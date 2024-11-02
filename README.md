# proyecto-cine-backend:
Trabajo Práctico en conjunto, con Front de otro repositorio complementario (Linnk del Front:https://github.com/RicardoAlvarez1980/proyecto-cine-frontend)
Integrantes: Achaga Pérez, Agustín - Alvarez, Ricardo.
## Descripción:
Este proyecto es la API backend para un sistema de reserva de butacas en cines. Permite gestionar cines, películas, horarios y reservas a través de operaciones CRUD (Crear, Leer, Actualizar y Eliminar). El backend está construido con Node.js y Express, y utiliza MongoDB como base de datos.
## Estructura del Proyecto:
El proyecto está organizado en varias carpetas y archivos, cada uno con una función específica:
Estructura de Carpetas:
/models: Contiene los modelos de datos de Mongoose que representan las colecciones en la base de datos.
/routes: Define las rutas de la API para manejar las solicitudes HTTP.
/controllers: Contiene la lógica de negocio que maneja las operaciones de las rutas.
/config: Incluye la configuración de la conexión a la base de datos y otras configuraciones necesarias.

## Modelos de Datos:
Cinema.js
Representa un cine en la base de datos.
Incine las relaciones con las películas y horarios.

Movie.js:
Representa una película.
Incluye campos como título, duración, y tráiler.
Permite asociar múltiples horarios.

Showtime.js:
Representa un horario de una película en un cine específico.
Incluye campos como fecha, cine, película, y disponibilidad.
## Rutas:
Cines:
Rutas para manejar las operaciones sobre los cines:
GET /cines: Obtener la lista de cines.
POST /cines: Crear un nuevo cine.
PUT /cines/:id: Actualizar un cine existente.
DELETE /cines/:id: Eliminar un cine.

Películas:
Rutas para manejar las operaciones sobre las películas:
GET /peliculas: Obtener la lista de películas.
POST /peliculas: Crear una nueva película.
PUT /peliculas/:id: Actualizar una película existente.
DELETE /peliculas/:id: Eliminar una película.

Horarios:
Rutas para manejar las operaciones sobre los horarios:
GET /horarios: Obtener la lista de horarios.
POST /horarios: Crear un nuevo horario.
PUT /horarios/:id: Actualizar un horario existente.
DELETE /horarios/:id: Eliminar un horario.

Reservas:
Rutas para manejar las operaciones sobre reservas:
GET /reservas: Obtener la lista de reservas.
POST /reservas: Crear una nueva reserva.
DELETE /reservas/:id: Eliminar una reserva.

## Tecnologías Utilizadas:
Node.js: Entorno de ejecución para JavaScript del lado del servidor.
Express.js: Framework para construir aplicaciones web en Node.js.
MongoDB: Base de datos NoSQL utilizada para almacenar datos de manera flexible.
Mongoose: Biblioteca de modelado de objetos MongoDB para Node.js.
cors: Middleware para habilitar CORS (Cross-Origin Resource Sharing).

## Explicación del Flujo:
Gestión de Cines: El administrador puede agregar, editar o eliminar cines a través de las rutas definidas.
Gestión de Películas: Permite al administrador añadir nuevas películas y asociarlas con horarios.
Gestión de Horarios: Los horarios se pueden crear y modificar según la disponibilidad de las salas y películas.
## Instalación y Ejecución:
Clonar el repositorio:
git clone [https://github.com/AgustinAchagaPerez/proyecto-cine-backend.git](https://github.com/RicardoAlvarez1980/proyecto-cine-backend)
Navegar a la carpeta del proyecto:
cd proyecto-cine-backend
Instalar las dependencias:
npm install
Configurar la base de datos MongoDB en el archivo config.js.
Iniciar el servidor:
npm start
Una vez realizados los pasos anteriores,se requiere también lo siguiente:
tener una Base de Datos en MongoDB, obtener el string de conexión de la misma.

crear un archivo .env en el cual se va a ingresar el string de conexión de la base de datos MongoDB, como asi tambien el puerto en el que va a correr la misma desde el localhost (tu computadora)

Una vez todo esto creado, y finalizada la construccion del server.js, habiendo instalado node (npm i node), para inicializar el mismo haces lo siguiente:
Abrir la consola: terminal > new terminal. Una vez dentro de la misma, escribes: node server.js. En caso de que todo funcione con normalidad, te aparece el mensaje comunicando dicha cuestión. 

Dentro del archivo server.js, se encuentran los "CRUD" es un conjunto de cuatro operaciones básicas que se realizan en una base de datos o en cualquier aplicación donde gestionamos información. Estas cuatro operaciones son Crear, Leer, Actualizar y Eliminar (del inglés: Create, Read, Update, Delete). En palabras más sensillas, las vamos a explicar a continuaci:
1. Crear (Create):
Qué significa: Es agregar nuevos datos o información a la aplicación o base de datos.
Ejemplo en la vida real: Cuando te registras en una página web, estás creando un "usuario". La información como tu nombre, correo y contraseña se guarda en la base de datos.
En el proyecto: Cuando un nuevo usuario se registra, su información se guarda en la base de datos. En el código, la operación de "Crear" se realiza mediante una petición HTTP de tipo POST.
Ejemplo:
app.get('/cines', async (req, res) => {
  try {
    const cines = await Cine.find().populate('salas');  // Obtiene cines con las salas asociadas
    res.json(cines);  // Envía los cines encontrados
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los cines', error });
  }
});
Obtiene todos los cines desde la base de datos.
Devuelve una lista de cines al frontend.

2. Leer (Read):
Qué significa: Es consultar o ver los datos que ya existen en la base de datos o en la aplicación.
Ejemplo en la vida real: Cuando inicias sesión en tu cuenta de correo electrónico y ves tus mensajes, estás leyendo la información guardada.
En el proyecto: El sistema puede mostrar una lista de usuarios ya registrados. Esto se hace con una petición HTTP de tipo GET que obtiene los datos de la base de datos.

Ejemplo:
app.get('/cines/:id', async (req, res) => {
  try {
    const cine = await Cine.findById(req.params.id).populate('salas');  // Busca cine por ID
    if (!cine) return res.status(404).json({ message: 'Cine no encontrado' });
    res.json(cine);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener cine', error });
  }
});
Busca un cine por su ID y lo devuelve si es encontrado.

3. Actualizar (Update):
Qué significa: Es modificar o cambiar la información que ya está en la base de datos.
Ejemplo en la vida real: Cuando editas tu perfil de redes sociales y cambias tu foto o nombre, estás actualizando tus datos.
En el proyecto: Un usuario puede actualizar su información, como su nombre o email. Esto se hace con una petición HTTP de tipo PUT o PATCH, que permite modificar los datos existentes en la base de datos.
Ejemplo:
Actualizar un cine por ID (PUT)
Este método permite actualizar un cine.
app.put('/cines/:id', async (req, res) => {
  try {
    const cineActualizado = await Cine.findByIdAndUpdate(req.params.id, req.body, { new: true });  // Actualiza el cine
    if (!cineActualizado) return res.status(404).json({ message: 'Cine no encontrado' });
    res.json(cineActualizado);  // Devuelve el cine actualizado
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el cine', error });
  }
});
Actualiza un cine según el ID con los datos enviados en el req.body.

5. Eliminar (Delete):
Qué significa: Es borrar o eliminar datos que ya existen en la base de datos.
Ejemplo en la vida real: Si decides eliminar una cuenta de alguna aplicación, esa información desaparece de la base de datos.
En el proyecto: Si decides eliminar a un usuario, su información se elimina de la base de datos. Esto se hace con una petición HTTP de tipo DELETE.

Ejemplo:
Eliminar un cine por ID (DELETE)
Este método permite eliminar un cine.
app.delete('/cines/:id', async (req, res) => {
  try {
    const cine = await Cine.findById(req.params.id);
    if (!cine) {
      return res.status(404).json({ message: 'Cine no encontrado' });
    }
    await Sala.deleteMany({ cine: cine._id });  // Elimina las salas del cine
    await Cine.findByIdAndDelete(req.params.id);  // Elimina el cine
    res.status(200).send({ message: 'Cine eliminado con éxito' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
Busca el cine por su ID.
Si lo encuentra, elimina el cine y las salas asociadas.


## Explicación del Flujo
Gestión de Cines: El administrador puede agregar, editar o eliminar cines a través de las rutas definidas.
Gestión de Películas: Permite al administrador añadir nuevas películas y asociarlas con horarios.
Gestión de Horarios: Los horarios se pueden crear y modificar según la disponibilidad de las salas y películas.
Reservas de Butacas: Los usuarios pueden realizar reservas de butacas a través de la API, asegurando que solo se puedan reservar asientos disponibles.
## Notas Técnicas:
Asegúrate de tener MongoDB corriendo localmente o utilizar un servicio en la nube como MongoDB Atlas.
Para depurar y probar las rutas, puedes utilizar herramientas como Postman.
## Mejoras a futuro:
Reservas de Butacas: Los usuarios podrán realizar reservas de butacas a través de la API, asegurando que solo se puedan reservar asientos disponibles.
Creacion de un archivo de reservas pensado de la siguiente manera:
Reservation.js:
Representa una reserva de butacas.
Incluye información sobre el usuario, las butacas seleccionadas y el horario reservado.
## Contribuciones:
Si deseas contribuir a este proyecto, por favor haz un fork del repositorio y envía un pull request.




## Explicación del Flujo
Gestión de Cines: El administrador puede agregar, editar o eliminar cines a través de las rutas definidas.
Gestión de Películas: Permite al administrador añadir nuevas películas y asociarlas con horarios.
Gestión de Horarios: Los horarios se pueden crear y modificar según la disponibilidad de las salas y películas.
Reservas de Butacas: Los usuarios pueden realizar reservas de butacas a través de la API, asegurando que solo se puedan reservar asientos disponibles.
## Notas Técnicas:
Asegúrate de tener MongoDB corriendo localmente o utilizar un servicio en la nube como MongoDB Atlas.
Para depurar y probar las rutas, puedes utilizar herramientas como Postman.
## Mejoras a futuro:
Reservas de Butacas: Los usuarios podrán realizar reservas de butacas a través de la API, asegurando que solo se puedan reservar asientos disponibles.
Creacion de un archivo de reservas pensado de la siguiente manera:
Reservation.js:
Representa una reserva de butacas.
Incluye información sobre el usuario, las butacas seleccionadas y el horario reservado.
## Contribuciones:
Si deseas contribuir a este proyecto, por favor haz un fork del repositorio y envía un pull request.#   p r o y e c t o - c i n e - b a c k e n d 
 
 #   p r o y e c t o - c i n e - b a c k e n d 
 
 
