# ----------------------------------------------------
# STAGE 1: BACKEND - Build Java/Maven
# ----------------------------------------------------
FROM maven:3.9.9-amazoncorretto-21-alpine AS backend-build
WORKDIR /app/backend
# O 'COPY' precisa ser ajustado para a nova estrutura de contexto de build (iremos rodar o build do diretório pai)
COPY backend/pom.xml .
COPY backend/src ./src
# Compila o projeto e pula os testes
RUN mvn clean package -DskipTests

# ----------------------------------------------------
# STAGE 2: FRONTEND - Instalação de Dependências Node.js
# ----------------------------------------------------
FROM node:20-alpine AS frontend-deps
WORKDIR /app/frontend
# Copia os arquivos de definição de dependência do frontend (do diretório raiz do projeto)
COPY frontend/package*.json ./
# Instala as dependências do Node (o --legacy-peer-deps é comum no React Native)
RUN npm install --legacy-peer-deps

# ----------------------------------------------------
# STAGE 3: FRONTEND - Compilação do APK Android
# ----------------------------------------------------
# Usamos uma imagem com Android SDK e Node.js. (reactnativecommunity/react-native-android é um bom ponto de partida)
FROM reactnativecommunity/react-native-android:latest AS frontend-build
WORKDIR /app
# Copia todo o código-fonte do frontend
COPY frontend/ ./frontend/
# Copia as dependências (node_modules) instaladas do Stage 2
COPY --from=frontend-deps /app/frontend/node_modules ./frontend/node_modules

# O React Native precisa ter o SDK configurado (a imagem base geralmente já faz, mas é bom garantir)
ENV ANDROID_SDK_ROOT /usr/local/android-sdk 
ENV PATH $PATH:$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$ANDROID_SDK_ROOT/platform-tools

# NOTA IMPORTANTE: Para uma compilação de release, o keystore e o gradle.properties
# DEVEM ser injetados neste stage através de uma instrução COPY ou ADD.
# Exemplo: COPY path/to/keystore/my-release-key.keystore /root/.android/
# Exemplo: COPY frontend/android/gradle.properties frontend/android/

WORKDIR /app/frontend/android
# Comando para gerar a APK de release
RUN ./gradlew assembleRelease

# ----------------------------------------------------
# STAGE 4: BACKEND - Imagem de Execução Final
# ----------------------------------------------------
FROM amazoncorretto:21-alpine AS backend-runtime # Novo nome do Stage
WORKDIR /app
# Copia o JAR gerado no Stage 1
COPY --from=backend-build /app/backend/target/*.jar app.jar
EXPOSE 8417
ENTRYPOINT ["java", "-jar", "app.jar"]

# ----------------------------------------------------
# STAGE 5: ARTIFACT - Extração do APK
# ----------------------------------------------------
FROM alpine:latest AS apk-artifact # Novo Stage para o artefato
WORKDIR /app
# Copia o APK gerado do Stage 3
COPY --from=frontend-build /app/frontend/android/app/build/outputs/apk/release/app-release.apk ./edificar-app-release.apk