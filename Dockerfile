############################
# 1) Build do BACKEND Java #
############################
FROM maven:3.9.9-amazoncorretto-21-alpine AS backend-build

WORKDIR /backend

# Copia apenas o pom.xml para baixar dependências (melhor cache)
COPY backend/pom.xml .

# -B: Modo Batch (remove cores e barras de progresso interativas)
# -q: Quiet (imprime apenas erros e avisos críticos)
RUN mvn dependency:go-offline -B -q

COPY backend/src ./src
RUN mvn clean package -DskipTests -B -q

#########################################
# 2) Build do APK React Native (Android)#
#########################################
FROM eclipse-temurin:21-jdk AS mobile-build

# Instalação de dependências do sistema
# -qq: Modo silencioso do apt-get
RUN apt-get update -qq && \
    apt-get install -yqq --no-install-recommends \
    curl \
    git \
    unzip \
    nodejs \
    npm \
    && npm install -g yarn --silent \
    && rm -rf /var/lib/apt/lists/*

# Configuração do Android SDK
ENV ANDROID_HOME=/opt/android-sdk
ENV PATH=$ANDROID_HOME/cmdline-tools/latest/bin:$ANDROID_HOME/platform-tools:$PATH

# Baixa e configura o Command Line Tools
# Redirecionamos a saída do unzip para /dev/null para evitar logs de extração de arquivo por arquivo
RUN mkdir -p $ANDROID_HOME/cmdline-tools && \
    curl -Lo sdk.zip https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip && \
    unzip -q sdk.zip -d $ANDROID_HOME/cmdline-tools && \
    rm sdk.zip && \
    mv $ANDROID_HOME/cmdline-tools/cmdline-tools $ANDROID_HOME/cmdline-tools/latest

# Aceita licenças e instala plataformas e ferramentas de build
# Redirecionamos a saída para /dev/null para evitar o spam de licenças, mantendo a entrada do 'yes'
RUN yes | sdkmanager --sdk_root=${ANDROID_HOME} --licenses > /dev/null 2>&1 && \
    yes | sdkmanager --sdk_root=${ANDROID_HOME} "platform-tools" "platforms;android-34" "build-tools;34.0.0" > /dev/null 2>&1

WORKDIR /frontend

# Copia dependências do NPM
COPY frontend/package.json frontend/package-lock.json ./

# Instala dependências do projeto
# --silent: Oculta logs de instalação
# --no-progress: Remove barra de progresso
RUN npm install --silent --no-progress

# Copia o código fonte do frontend
COPY frontend/ .

# Expo Prebuild
# --no-install: Não tenta instalar deps novamente
# --clean: Garante que builds anteriores não interfiram
RUN npx expo prebuild --platform android --clean

# Build do APK (Gradle)
WORKDIR /frontend/android
RUN chmod +x ./gradlew && \
    # -q: Quiet (apenas erros)
    # --console=plain: Remove formatação de terminal interativo (barra de progresso)
    # -x test: Pula os testes unitários para agilizar o build
    ./gradlew assembleRelease -q --console=plain -x test

#########################################
# 3) Imagem final de runtime do backend #
#########################################
FROM amazoncorretto:21-alpine

WORKDIR /app

# Copia o JAR do backend (o nome do jar pode variar, garantindo que pegue o correto)
COPY --from=backend-build /backend/target/*.jar app.jar

# Cria diretório para o APK
RUN mkdir -p /app/apk

# Copia o APK gerado
COPY --from=mobile-build /frontend/android/app/build/outputs/apk/release/app-release.apk /app/apk/app-release.apk

EXPOSE 8417

CMD ["java", "-jar", "/app/app.jar"]