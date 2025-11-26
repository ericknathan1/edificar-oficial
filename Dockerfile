############################
# 1) Build do BACKEND Java #
############################
FROM maven:3.9.9-amazoncorretto-21-alpine AS backend-build

WORKDIR /backend

# Copia apenas o pom.xml para cache
COPY backend/pom.xml .
RUN mvn dependency:go-offline -B -q

COPY backend/src ./src
RUN mvn clean package -DskipTests -B -q

#########################################
# 2) Build do APK React Native (Android)#
#########################################
FROM eclipse-temurin:21-jdk AS mobile-build

# Limite de memória para o PROCESSO DE BUILD (Gradle)
# Ajustado para não estourar containers pequenos
ENV _JAVA_OPTIONS="-Xmx2g"

# Instalação de dependências + Node 22 + Limpeza imediata
# Removido 'dos2unix' conforme solicitado
RUN apt-get update -qq && \
    apt-get install -yqq --no-install-recommends curl git unzip gnupg && \
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -yqq nodejs && \
    npm install -g yarn --silent && \
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

# Instala NDK e CMake específicos
RUN yes | sdkmanager --sdk_root=${ANDROID_HOME} --licenses > /dev/null 2>&1 && \
    yes | sdkmanager --sdk_root=${ANDROID_HOME} \
        "platform-tools" \
        "platforms;android-34" \
        "build-tools;34.0.0" \
        "ndk;27.1.12297006" \
        "cmake;3.22.1" > /dev/null 2>&1

ENV ANDROID_NDK_HOME=${ANDROID_HOME}/ndk/27.1.12297006

WORKDIR /frontend

# Instala deps e limpa cache
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install --silent --no-progress && npm cache clean --force

# Copia código e faz o prebuild
COPY frontend/ .
RUN npx expo prebuild --platform android --no-install --clean

WORKDIR /frontend/android

# Build do Gradle (Sem dos2unix)
RUN chmod +x ./gradlew && \
    ./gradlew assembleRelease -q --console=plain -x test --no-daemon

#########################################
# 3) Imagem final de runtime do backend #
#########################################
FROM amazoncorretto:21-alpine

WORKDIR /app

# Configuração de memória para rodar em container de 2GB
# Deixa ~500MB livres para o sistema operacional do container
ENV _JAVA_OPTIONS="-Xmx1536m"

# Volume persistente
RUN mkdir -p /var/lib/app_dados && chmod 777 /var/lib/app_dados
VOLUME /var/lib/app_dados

# Copia artefatos
COPY --from=backend-build /backend/target/*.jar app.jar
RUN mkdir -p /app/apk
COPY --from=mobile-build /frontend/android/app/build/outputs/apk/release/app-release.apk /app/apk/app-release.apk

EXPOSE 8417
CMD ["java", "-jar", "/app/app.jar"]