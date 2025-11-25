############################
# 1) Build do BACKEND Java #
############################
FROM maven:3.9.9-amazoncorretto-21-alpine AS backend-build

WORKDIR /backend

# Copia apenas o necessário para cachear melhor
COPY backend/pom.xml .
RUN mvn dependency:go-offline

COPY backend/src ./src
RUN mvn clean package -DskipTests



#########################################
# 2) Build do APK React Native (Android)#
#########################################
# Aqui eu uso uma imagem baseada em Debian/Ubuntu
# porque Android SDK não gosta muito de Alpine.
FROM eclipse-temurin:17-jdk AS mobile-build

# Instala Node, npm, etc. (exemplo simples, ajuste versões conforme seu projeto)
RUN apt-get update && \
    apt-get install -y curl git unzip nodejs npm && \
    npm install -g yarn && \
    rm -rf /var/lib/apt/lists/*

# Instala Android SDK (modelo bem básico)
ENV ANDROID_HOME=/opt/android-sdk
ENV PATH=$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH

RUN mkdir -p $ANDROID_HOME/cmdline-tools && \
    curl -Lo sdk.zip https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip && \
    unzip sdk.zip -d $ANDROID_HOME/cmdline-tools && \
    rm sdk.zip && \
    mv $ANDROID_HOME/cmdline-tools/cmdline-tools $ANDROID_HOME/cmdline-tools/latest && \
    yes | sdkmanager --sdk_root=${ANDROID_HOME} "platform-tools" "platforms;android-34" "build-tools;34.0.0"

WORKDIR /frontend

# Dependências do RN
COPY frontend/package.json frontend/package-lock.json ./
RUN npm install

# Copia o restante do projeto mobile
COPY frontend/ .

RUN npx expo prebuild --platform android --no-interactive

# Dá permissão e gera o APK release
WORKDIR /frontend/android
RUN chmod +x ./gradlew && \
    ./gradlew assembleRelease



#########################################
# 3) Imagem final de runtime do backend #
#########################################
FROM amazoncorretto:21-alpine

WORKDIR /app

# Copia o JAR do backend
COPY --from=backend-build /backend/target/*.jar app.jar

# Garante que a pasta exista (não é obrigatório, mas deixa claro)
RUN mkdir -p /app/apk

# Copia o APK gerado pelo estágio mobile
COPY --from=mobile-build /frontend/android/app/build/outputs/apk/release/app-release.apk /app/apk/app-release.apk

EXPOSE 8417

CMD ["java", "-jar", "/app/app.jar"]