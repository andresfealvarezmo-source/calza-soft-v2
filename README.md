# Calza Soft - Sistema de Gestión de Tienda de Calzado

Aplicación web profesional desarrollada para la administración integral de productos, precios, inventario y puntos de venta de la tienda **Calza Soft**, cumpliendo estrictamente con los requisitos del curso de Desarrollo Informático IV (Universidad ECCI).

## Tecnologías Utilizadas
* **Frontend:** HTML5, CSS3 Moderno, JavaScript Vanilla.
* **Backend:** Node.js, Express.js.
* **Base de Datos:** MySQL / MariaDB.
* **Pruebas:** Jest, Supertest.

## Requisitos de Instalación
1. Tener instalado [Node.js](https://nodejs.org/) (versión 18 o superior).
2. Tener instalado un servidor de base de datos MySQL (p. ej., XAMPP, WAMP o MySQL Server).

## Configuración y Ejecución paso a paso

### 1. Configuración de la Base de Datos
* Abre tu gestor de base de datos MySQL favorito (phpMyAdmin, MySQL Workbench o consola).
* Ejecuta el script completo ubicado en `database/schema.sql` para crear las tablas.
* Ejecuta el script de datos iniciales ubicado en `database/seed.sql` para cargar usuarios, productos, inventario y puntos de venta.

### 2. Instalación de Dependencias del Backend
Abre una terminal en la carpeta del proyecto y ejecuta:
```bash
cd backend
npm install
```

### 3. Ejecución del Servidor Backend
```bash
npm start
```
El servidor se iniciará en ``.

### 4. Acceso al Frontend
Abre el archivo `frontend/templates/login.html` directamente en tu navegador web o sírvelo con un entorno local en Visual Studio Code (Live Server).

### 5. Credenciales de Demostración
* **Administrador:** `admin@calzasoft.com` / `admin123`
* **Vendedor:** `vendedor@calzasoft.com` / `vendedor123`


### 6. Ejecución de Pruebas Automatizadas
```bash
cd backend
npm test
```
