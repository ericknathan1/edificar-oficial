############################
# 1) Build do BACKEND Java #
############################
FROM maven:3.9.9-amazoncorretto-21-alpine AS backend-build

WORKDIR /backend

# Copia apenas o pom.xml para cache de dependências
COPY backend/pom.xml .
RUN mvn dependency:go-offline -B -q

# Copia o código fonte e compila
COPY backend/src ./src
RUN mvn clean package -DskipTests -B -q

#########################################
# 2) Imagem final de runtime do backend #
#########################################
FROM amazoncorretto:21-alpine

WORKDIR /app

# Configuração de memória (pode ajustar conforme seu servidor)
ENV _JAVA_OPTIONS="-Xmx1536m"

# Volume persistente
RUN mkdir -p /var/lib/app_dados && chmod 777 /var/lib/app_dados
VOLUME /var/lib/app_dados

# Copia apenas o JAR gerado no estágio anterior
COPY --from=backend-build /backend/target/*.jar app.jar

EXPOSE 8417
CMD ["java", "-jar", "/app/app.jar"]