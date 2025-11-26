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

# Instalação de dependências do sistema e utilitários
# Adicionado 'dos2unix' para corrigir arquivos vindos do Windows
RUN apt-get update -qq && \
    apt-get install -yqq --no-install-recommends \
    curl \
    git \
    unzip \
    dos2unix \
    gnupg

# --- INSTALAÇÃO DO NODE.JS 22 ---
# Baixa o script de setup oficial do NodeSource para a versão 22
RUN curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && \
    apt-get install -yqq nodejs && \
    npm install -g yarn --silent && \
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

# --- INSTALAÇÃO DE PACOTES ANDROID (FIX DO ERRO) ---
# Adicionamos 'ndk;27.1.12297006' e 'cmake;3.22.1' explicitamente
RUN yes | sdkmanager --sdk_root=${ANDROID_HOME} --licenses > /dev/null 2>&1 && \
    yes | sdkmanager --sdk_root=${ANDROID_HOME} \
        "platform-tools" \
        "platforms;android-34" \
        "build-tools;34.0.0" \
        "ndk;27.1.12297006" \
        "cmake;3.22.1" > /dev/null 2>&1

# Define a variável de ambiente para o NDK (ajuda o Gradle a encontrá-lo)
ENV ANDROID_NDK_HOME=${ANDROID_HOME}/ndk/27.1.12297006

WORKDIR /frontend

# Copia dependências do Frontend
COPY frontend/package.json frontend/package-lock.json ./

# Instala dependências (Silencioso)
RUN npm install --silent --no-progress

# Copia o código fonte
COPY frontend/ .

# Gera as pastas nativas do Android (Prebuild)
RUN npx expo prebuild --platform android --no-install --clean

WORKDIR /frontend/android

# Prepara e executa o Build do Gradle
# 1. chmod: Garante permissão de execução
# 2. dos2unix: Remove quebras de linha do Windows (\r\n) que quebram o build no Linux
# 3. gradlew: Roda em modo silencioso e sem console interativo
RUN chmod +x ./gradlew && \
    dos2unix ./gradlew && \
    ./gradlew assembleRelease -q --console=plain -x test

#########################################
# 3) Imagem final de runtime do backend #
#########################################
FROM amazoncorretto:21-alpine

WORKDIR /app

# Copia o JAR compilado no estágio 1
COPY --from=backend-build /backend/target/*.jar app.jar

# Cria diretório e copia o APK compilado no estágio 2
RUN mkdir -p /app/apk
COPY --from=mobile-build /frontend/android/app/build/outputs/apk/release/app-release.apk /app/apk/app-release.apk

EXPOSE 8417

CMD ["java", "-jar", "/app/app.jar"]