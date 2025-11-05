# Etapa 1: Construcción
FROM maven:3.9.6-eclipse-temurin-21 AS build

# Establecemos el directorio de trabajo
WORKDIR /app

# Copiamos todo el proyecto
COPY pom.xml .
COPY src ./src

# Descargamos las dependencias y construimos el JAR
RUN mvn clean package -DskipTests

# Etapa 2: Imagen final
FROM openjdk:21-jdk-slim

# Establecemos el directorio de trabajo
WORKDIR /app

# Copiamos el JAR construido en la etapa anterior
COPY --from=build /app/target/*.jar app.jar

# Exponemos el puerto de la app (Spring Boot normalmente usa el 8080)
EXPOSE 8080

# Comando para ejecutar la aplicación
ENTRYPOINT ["java", "-jar", "app.jar"]

