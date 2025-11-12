# **GreenTrack Lite - Sistema de Control de Préstamos de Equipos**

Proyecto **Fullstack (Spring Boot + Angular)** desarrollado para la gestión y control de préstamos de equipos de cómputo *(laptops, monitores, teclados, etc.)*.

---

## 📋 **Tecnologías Utilizadas**

| Tecnología | Versión / Descripción |
|-------------|------------------------|
| ☕ **Java** | 11 *(Microsoft Build of OpenJDK)* |
| 🌱 **Spring Boot** | 2.7.18 |
| 🐬 **MySQL** | 8+ |
| 🟢 **Node.js** | v20.15.1+ |
| 🔺 **Angular CLI** | v17.0.6+ |
| 🧩 **Maven** | Gestión de dependencias del backend |

---

## 🚀 **Guía de Instalación y Ejecución**

Sigue estos pasos para levantar el proyecto localmente

---

### 🗄️ **1. Configuración de la Base de Datos**

1. Abre tu cliente de MySQL *(Workbench, DBeaver, etc.)*  
2. Ejecuta el script `greentrackbd.sql` ubicado en la carpeta `/database` del repositorio.  
3. Este script creará la base de datos `greentrack`, las tablas *(usuarios, equipos, préstamos)* e insertará datos de prueba:
   - 👤 **2 usuarios**
   - 💻 **12 equipos**
   - 📦 **3 préstamos**

---

### ⚙️ **2. Ejecución del Backend (Spring Boot)**

📁 Navega a la carpeta `/greentrack` del proyecto.

Verifica el archivo de configuración:
```properties
# src/main/resources/application.properties
spring.datasource.url=jdbc:mysql://localhost:3306/greentrack
spring.datasource.username=TU_USUARIO_MYSQL
spring.datasource.password=TU_PASSWORD_MYSQL

▶️ Compila y ejecuta el proyecto:

# Instalar dependencias y compilar
mvn clean install

# Ejecutar la aplicación
mvn spring-boot:run
El backend estará disponible en 👉 http://localhost:8090

💡 3. Ejecución del Frontend (Angular)
📁 Abre una nueva terminal y navega a la carpeta /greentrack-frontend.

Instala las dependencias:

npm install
Inicia el servidor de desarrollo:

ng serve -o
El frontend se abrirá automáticamente en tu navegador:
👉 http://localhost:4200/auth/login

🌎 URLs Disponibles
Servicio	URL
🌐 Frontend	http://localhost:4200/auth/login
⚙️ Backend API	http://localhost:8090
📘 Swagger UI	http://localhost:8090/swagger-ui/index.html

🧪 Pruebas de API

📬 Colección Postman
Se ha incluido un archivo de colección Postman:

📁 /postman/APIs Greentrack-pruebas.postman_collection.json

Puedes importarlo directamente en Postman para probar todas las APIs disponibles:

📘 Documentación Swagger
Explora y prueba todos los endpoints de la API de forma interactiva:

🔗 http://localhost:8090/swagger-ui/index.html

🔐 Login

💻 CRUD de Equipos

📦 CRUD de Préstamos

🧠 Notas Finales
🧩 Proyecto creado para fines de prueba técnica

🔒 No incluye datos sensibles ni llaves privadas

☕ Compatible con Java 11 y MySQL 8

⚡ Ejecutable localmente sin configuraciones adicionales

👤 Autor
Ruben Angel Ocaña Celedonio
📅 Año: 2025
