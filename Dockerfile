############################
# 1) Build do BACKEND Java #
############################
FROM maven:3.9.9-amazoncorretto-21-alpine AS backend-build

WORKDIR /backend
COPY backend/pom.xml .
RUN mvn dependency:go-offline -B -q

COPY backend/src ./src
RUN mvn clean package -DskipTests -B -q

#########################################
# 2) Build do APK React Native (Android)#
#########################################
FROM eclipse-temurin:21-jdk AS mobile-build

# Aumenta a memória disponível para o Gradle (Opcional, ajuda em builds grandes)
ENV _JAVA_OPTIONS="-Xmx4g"

# Instalação de dependências + Node 22 + Limpeza imediata
RUN apt-get update -qq && \
    apt-get install -yqq --no-install-recommends curl git unzip dos2unix gnupg && \
    curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -yqq nodejs && \
    npm install -g yarn --silent && \
    # Limpa cache do apt para economizar espaço na imagem
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# --- CONFIGURAÇÃO ANDROID SDK ---
ENV ANDROID_HOME=/opt/android-sdk
ENV PATH=$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH

# Baixa Command Line Tools e deleta o ZIP na mesma camada
RUN mkdir -p $ANDROID_HOME/cmdline-tools && \
    curl -Lo sdk.zip https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip && \
    unzip -q sdk.zip -d $ANDROID_HOME/cmdline-tools && \
    rm sdk.zip && \
    mv $ANDROID_HOME/cmdline-tools/cmdline-tools $ANDROID_HOME/cmdline-tools/latest

# Instala NDK e CMake (Pesados!)
# Removemos arquivos temporários do sdkmanager se possível (embora ele gerencie seu próprio cache)
RUN yes | sdkmanager --sdk_root=${ANDROID_HOME} --licenses > /dev/null 2>&1 && \
    yes | sdkmanager --sdk_root=${ANDROID_HOME} \
        "platform-tools" \
        "platforms;android-34" \
        "build-tools;34.0.0" \
        "ndk;27.1.12297006" \
        "cmake;3.22.1" > /dev/null 2>&1

ENV ANDROID_NDK_HOME=${ANDROID_HOME}/ndk/27.1.12297006

WORKDIR /frontend

# Copia apenas arquivos de dependência primeiro
COPY frontend/package.json frontend/package-lock.json ./

# Instala deps e limpa o cache do NPM imediatamente
RUN npm install --silent --no-progress && npm cache clean --force

# Copia o restante do código (O .dockerignore vai impedir que node_modules local venha junto)
COPY frontend/ .

# Prebuild
RUN npx expo prebuild --platform android --no-install --clean

WORKDIR /frontend/android

# Build do Gradle com --no-daemon para economizar memória/processos
RUN chmod +x ./gradlew && \
    dos2unix ./gradlew && \
    ./gradlew assembleRelease -q --console=plain -x test --no-daemon

#########################################
# 3) Imagem final de runtime do backend #
#########################################
FROM amazoncorretto:21-alpine

WORKDIR /app
COPY --from=backend-build /backend/target/*.jar app.jar
RUN mkdir -p /app/apk
COPY --from=mobile-build /frontend/android/app/build/outputs/apk/release/app-release.apk /app/apk/app-release.apk

EXPOSE 8417
CMD ["java", "-jar", "/app/app.jar"]