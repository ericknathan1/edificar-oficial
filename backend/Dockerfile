# Etapa de Build
FROM maven:3.9.9-amazoncorretto-21-alpine AS build
WORKDIR /app
COPY . .
# Compila o projeto e pula os testes para evitar o erro de JVM que ocorreu no seu log
RUN mvn clean package -DskipTests

# Etapa de Execução
FROM amazoncorretto:21-alpine
WORKDIR /app
# Copia o JAR gerado na etapa anterior
COPY --from=build /app/target/*.jar app.jar
EXPOSE 8417
ENTRYPOINT ["java", "-jar", "app.jar"]