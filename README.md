# ToDo:

- modificar la fecha de la base de datos a un timestamp
- crear pantalla de login
- ✅revisar porque no se cambia el hacer el check de adopted
- ✅añadido modal de edicion de animales
- ✅ajustar marca de agua (quizas un poco más grande y bajarle opacidad, incluir nombre de fido?)
- ✅controlar que al borrar un registro tambien se elimine la imagen de cloudinary
- ✅crear la marca de agua en las imágenes con el metodo composite de sharp
- ✅constrolar que la url que se recupera de cloudinary contenga una imágen
- ✅eliminar imágenes de la carpeta public una vez que las subimos a cloudinary
- ✅crear función con sharp que optimice las imagenes y añada marca de agua antes de subir a cloudinary y eliminar los registros de la carpeta public una vez subidas las imagenes
- ✅crear un loading que indique que el formulario se está enviando
- ✅añadir imagen miniatura a la izquierda del nombre en la tabla
- ✅Añadir funcionalidad al input de tipo check de adoptado para que actualice el valor de la base de datos.
- ✅Añadir funcionalidad al boton de eliminar para que elimine el registro de la base de datos con una ventana de confirmación antes.
- ✅mirar lo del pageClient para no exponer las variables de entorno en el cliente
- ✅revisar eslint
- ✅crear la conexión con cloudinary para el almacenamiento de imágenes
- ✅crear una vista sencilla de todas las entradas de la base de datos para permitir eliminar y actualizar registros

## Formulario para la web de fido.

- Se trata de un formulario para usa interno donde se pueden agregar nuevos animales,
  todos los datos agregados van a una base de datos creada con **_TURSO_**

- Las imágenes se guardan en cloudinary
- Esta web se usa como complemento para la gestion de la web principal

### Instrucciones

Para usar la aplicación:

- Clonar el repositorio en tu local
- Ejecutar `npm run dev`
- Abrir en el navegador localhost:3000
