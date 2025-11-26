############################
# 1) Build do BACKEND Java #
############################
FROM maven:3.9.9-amazoncorretto-21-alpine AS backend-build

WORKDIR /backend

# Copia apenas o pom.xml para baixar dependências (cache eficiente)
COPY backend/pom.xml .

# -B: Batch mode (sem cores/interativo)
# -q: Quiet (apenas erros/avisos)
RUN mvn dependency:go-offline -B -q

COPY backend/src ./src
RUN mvn clean package -DskipTests -B -q

#########################################
# 2) Build do APK React Native (Android)#
#########################################
FROM eclipse-temurin:21-jdk AS mobile-build

# Define o limite de memória do Java (Gradle) para 4GB
# ATENÇÃO: O ambiente onde o build rodar precisa ter > 5GB de RAM livre
ENV _JAVA_OPTIONS="-Xmx4g"

# Instalação de dependências + Node 22 + Limpeza imediata
RUN apt-get update -qq && \
    apt-get install -yqq --no-install-recommends curl git unzip dos2unix gnupg && \
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -yqq nodejs && \
    npm install -g yarn --silent && \
    # Limpa cache do apt para economizar espaço em disco
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# --- CONFIGURAÇÃO ANDROID SDK ---
ENV ANDROID_HOME=/opt/android-sdk
ENV PATH=$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH

# Baixa Command Line Tools
RUN mkdir -p $ANDROID_HOME/cmdline-tools && \
    curl -Lo sdk.zip https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip && \
    unzip -q sdk.zip -d $ANDROID_HOME/cmdline-tools && \
    rm sdk.zip && \
    mv $ANDROID_HOME/cmdline-tools/cmdline-tools $ANDROID_HOME/cmdline-tools/latest

# Instala NDK e CMake (Versões específicas exigidas pelo erro anterior)
RUN yes | sdkmanager --sdk_root=${ANDROID_HOME} --licenses > /dev/null 2>&1 && \
    yes | sdkmanager --sdk_root=${ANDROID_HOME} \
        "platform-tools" \
        "platforms;android-34" \
        "build-tools;34.0.0" \
        "ndk;27.1.12297006" \
        "cmake;3.22.1" > /dev/null 2>&1

ENV ANDROID_NDK_HOME=${ANDROID_HOME}/ndk/27.1.12297006

WORKDIR /frontend

# Copia dependências e instala (com limpeza de cache npm)
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install --silent --no-progress && npm cache clean --force

# Copia código fonte
COPY frontend/ .

# Prebuild do Expo
RUN npx expo prebuild --platform android --no-install --clean

WORKDIR /frontend/android

# Build do Gradle
# chmod: Permissão de execução
# dos2unix: Garante quebras de linha Linux
# assembleRelease: Gera o APK
RUN chmod +x ./gradlew && \
    dos2unix ./gradlew && \
    ./gradlew assembleRelease -q --console=plain -x test --no-daemon

#########################################
# 3) Imagem final de runtime do backend #
#########################################
FROM amazoncorretto:21-alpine

WORKDIR /app

# Define limite do Java para 4GB no Runtime
# Se o container for limitado externamente, garanta que o limite seja > 4GB
ENV _JAVA_OPTIONS="-Xmx4g"

# Prepara volume persistente
RUN mkdir -p /var/lib/app_dados && chmod 777 /var/lib/app_dados
VOLUME /var/lib/app_dados

# Copia artefatos (JAR do Backend + APK do Mobile)
COPY --from=backend-build /backend/target/*.jar app.jar
RUN mkdir -p /app/apk
COPY --from=mobile-build /frontend/android/app/build/outputs/apk/release/app-release.apk /app/apk/app-release.apk

EXPOSE 8417

CMD ["java", "-jar", "/app/app.jar"]