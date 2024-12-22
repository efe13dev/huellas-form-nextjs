# 🐾 Fido - Sistema de Gestión Interna para Protectora de Animales

## 📝 Descripción

Este proyecto es una aplicación web interna para la gestión de datos de la protectora de animales Huellas. Permite agregar, editar y eliminar registros de animales, con almacenamiento de imágenes optimizadas y autenticación de usuarios.

## ⭐ Características principales

- 📋 Formulario para agregar nuevos animales
- 🗄️ Base de datos gestionada con **TURSO**
- 💻 Desarrollado con Next.js, TypeScript, TailwindCSS y componentes shadcn
- 🖼️ Procesamiento de imágenes con Sharp (optimización y marca de agua)
- ☁️ Almacenamiento de imágenes en Cloudinary
- 🔐 Autenticación de usuarios con AuthJS
- ✏️ Interfaz para editar y eliminar registros existentes

## 🛠️ Tecnologías utilizadas

- ⚡ Next.js
- 📘 TypeScript
- 🎨 TailwindCSS
- 🔧 Sharp
- ☁️ Cloudinary
- 🔒 AuthJS
- 💾 TURSO (base de datos)

## 🚀 Instalación y uso

1. Clonar el repositorio:
   ```bash
   git clone [URL_DEL_REPOSITORIO]
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Ejecutar en modo desarrollo:
   ```bash
   npm run dev
   ```
4. Abrir en el navegador:
   ```bash
   http://localhost:3000
   ```

**Nota**: Se requiere autenticación para acceder a la aplicación.

## 📝 Tareas

- [x] Restringir el select files a imágenes y limitar la cantidad a 5
- [x] Hacer mas ancho el formulario de edición
- [x] Hacer el breakpoint para el responsive antes
- [x] Modificar la fecha de la base de datos a un timestamp
- [x] Crear pantalla de login
- [x] Añadir autenticación con AuthJS
- [x] Corregir funcionalidad de check de adopción
- [x] Añadir modal de edición de animales
- [x] Ajustar marca de agua en imágenes
- [x] Eliminar imágenes de Cloudinary al borrar registros
- [x] Implementar procesamiento de imágenes con Sharp
- [x] Crear loading para envío de formularios
- [x] Añadir miniaturas en la tabla de registros
- [x] Implementar actualización de estado de adopción
- [x] Añadir confirmación para eliminación de registros
- [x] Configurar variables de entorno seguras
- [x] Revisar y configurar ESLint
- [x] Implementar conexión con Cloudinary
- [x] Crear vista para gestión de registros (CRUD)

## 🤝 Contribución

Para contribuir al proyecto, por favor sigue estos pasos:

1. Haz un fork del repositorio
2. Crea una nueva rama (`git checkout -b feature/AmazingFeature`)
3. Realiza tus cambios y haz commit (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📲 Contacto

Para cualquier consulta o información adicional, puedes contactarme en:

- Email: efe13dev@gmail.com
