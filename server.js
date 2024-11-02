import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import Cine from './models/Cine.js';
import Sala from './models/Sala.js';
import Pelicula from './models/Pelicula.js';
import Horario from './models/Horario.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Conectar a MongoDB
mongoose.connect(process.env.MONGO_URI, {})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('Error al conectar MongoDB:', err));

// Middleware para parsear JSON
app.use(bodyParser.json());
app.use(cors());

// CRUD para Cine

// Crear un nuevo cine
app.post('/cines', async (req, res) => {
  const { nombre, ubicacion } = req.body;

  console.log(req.body); // Para verificar los datos recibidos

  const nuevoCine = new Cine({ nombre, ubicacion });

  try {
    const cineGuardado = await nuevoCine.save();
    res.status(201).json(cineGuardado);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear el cine', error });
  }
});

// Obtener todos los cines
app.get('/cines', async (req, res) => {
  try {
    const cines = await Cine.find().populate('salas');
    res.json(cines);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los cines', error });
  }
});

// Obtener un cine específico por ID
app.get('/cines/:id', async (req, res) => {
  try {
    const cine = await Cine.findById(req.params.id).populate('salas');
    if (!cine) return res.status(404).json({ message: 'Cine no encontrado' });
    res.json(cine);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener cine', error });
  }
});

// Actualizar un cine específico por ID
app.put('/cines/:id', async (req, res) => {
  try {
    const cineActualizado = await Cine.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cineActualizado) return res.status(404).json({ message: 'Cine no encontrado' });
    res.json(cineActualizado);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el cine', error });
  }
});

// Eliminar un cine y sus salas
app.delete('/cines/:id', async (req, res) => {
  try {
    const cine = await Cine.findById(req.params.id);
    if (!cine) {
      return res.status(404).json({ message: 'Cine no encontrado' });
    }

    // Desvincular y eliminar todas las salas asociadas
    await Sala.deleteMany({ cine: cine._id });

    // Eliminar el cine
    await Cine.findByIdAndDelete(req.params.id);
   
    res.status(200).send({ message: 'Cine eliminado con éxito' });


  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// CRUD para Sala

// Crear una nueva sala
app.post('/salas', async (req, res) => {
  const { numero_sala, butacas, cine, pelicula } = req.body;

  console.log(req.body); // Para verificar los datos recibidos

  const nuevaSala = new Sala({
    numero_sala,
    butacas,
    cine, // Vincula el cine
  });

  try {
    const salaGuardada = await nuevaSala.save();

    // Si se proporciona una película, vincúlala
    if (pelicula) {
      await Pelicula.findByIdAndUpdate(
        pelicula,
        { $addToSet: { salas: salaGuardada._id } } // Evita duplicados
      );
      // Actualiza la sala para incluir la película
      await Sala.findByIdAndUpdate(salaGuardada._id, { pelicula });
    }

    // Agregar la sala al cine correspondiente
    await Cine.findByIdAndUpdate(cine, { $push: { salas: salaGuardada._id } });

    res.status(201).json(salaGuardada);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear la sala', error });
  }
});

// Actualizar una sala
app.put('/salas/:id', async (req, res) => {
  try {
    const { numero_sala, butacas, pelicula, cine } = req.body;
    const salaActualizada = await Sala.findByIdAndUpdate(
      req.params.id,
      { numero_sala, butacas, cine },
      { new: true }
    );

    // Si se proporciona una película, actualiza el vínculo
    if (pelicula) {
      await Pelicula.findByIdAndUpdate(
        pelicula,
        { $addToSet: { salas: salaActualizada._id } } // Evita duplicados
      );
      await Sala.findByIdAndUpdate(salaActualizada._id, { pelicula });
    }

    res.status(200).json(salaActualizada);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// Agregar una película existente a una sala
app.put('/salas/:salaId/pelicula/:peliculaId', async (req, res) => {
  const { salaId, peliculaId } = req.params;

  try {
      // Verificar que la sala exista
      const sala = await Sala.findById(salaId);
      if (!sala) {
          return res.status(404).json({ message: 'Sala no encontrada' });
      }

      // Verificar que la película exista
      const pelicula = await Pelicula.findById(peliculaId);
      if (!pelicula) {
          return res.status(404).json({ message: 'Película no encontrada' });
      }

      // Vincular la película a la sala
      sala.pelicula = peliculaId; // Asegúrate de que el campo esté definido
      const updatedSala = await sala.save(); // Guarda y obtiene el objeto actualizado

      // Agregar la sala a la lista de salas de la película
      await Pelicula.findByIdAndUpdate(peliculaId, { $addToSet: { salas: salaId } });

      res.status(200).json(updatedSala); // Retorna el objeto actualizado
  } catch (error) {
      console.error(error); // Log para depuración
      res.status(500).json({ message: 'Error al agregar la película a la sala', error: error.message });
  }
});


// Eliminar una sala y desvincularla de la película
app.delete('/salas/:id', async (req, res) => {
  try {
    const sala = await Sala.findById(req.params.id);
    if (!sala) {
      return res.status(404).json({ message: 'Sala no encontrada' });
    }

    // Eliminar la sala
    await Sala.findByIdAndDelete(req.params.id);

    // Desvincular la sala de la película
    await Pelicula.findByIdAndUpdate(
      sala.pelicula,
      { $pull: { salas: sala._id } } // Elimina la sala de la película
    );

    // Desvincular la sala del cine
    await Cine.findByIdAndUpdate(
      sala.cine,
      { $pull: { salas: sala._id } } // Elimina la sala del cine
    );

    res.status(200).send({ message: 'Sala de Cine eliminada con éxito' });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.get('/salas', async (req, res) => {
  try {
    const salas = await Sala.find().populate('pelicula').populate('horarios');
    res.json(salas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las salas', error });
  }
});

app.get('/salas/:id', async (req, res) => {
  try {
    const sala = await Sala.findById(req.params.id).populate('pelicula').populate('horarios');
    if (!sala) return res.status(404).json({ message: 'Sala no encontrada' });
    res.json(sala);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la sala', error });
  }
});

app.put('/salas/:id', async (req, res) => {
  try {
    const salaActualizada = await Sala.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!salaActualizada) return res.status(404).json({ message: 'Sala no encontrada' });

    res.json(salaActualizada);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar la sala', error });
  }
});

app.delete('/salas/:id', async (req, res) => {
  try {
    const salaEliminada = await Sala.findByIdAndDelete(req.params.id);
    if (!salaEliminada) return res.status(404).json({ message: 'Sala no encontrada' });

    // Eliminar la sala del cine correspondiente
    await Cine.findByIdAndUpdate(salaEliminada.cine, { $pull: { salas: salaEliminada._id } });

    res.json({ message: 'Sala eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la sala', error });
  }
});

// CRUD para Pelicula

// Crear una nueva película
app.post('/peliculas', async (req, res) => {
  try {
    const { titulo, director, duracion, genero } = req.body;

    if (!titulo || !director || !duracion || !genero) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    console.log(req.body); // Para verificar los datos recibidos

    const pelicula = new Pelicula({
      titulo,
      director,
      duracion,
      genero,
    });

    await pelicula.save();
    res.status(201).json(pelicula);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Actualizar una película
app.put('/peliculas/:id', async (req, res) => {
  try {
    const { titulo, director, duracion, genero } = req.body;
    const peliculaActualizada = await Pelicula.findByIdAndUpdate(
      req.params.id,
      { titulo, director, duracion, genero },
      { new: true }
    );

    if (!peliculaActualizada) {
      return res.status(404).json({ message: 'Película no encontrada' });
    }

    res.status(200).json(peliculaActualizada);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Eliminar una película y sus salas relacionadas
app.delete('/peliculas/:id', async (req, res) => {
  try {
    const pelicula = await Pelicula.findById(req.params.id);
    if (!pelicula) {
      return res.status(404).json({ message: 'Película no encontrada' });
    }

    // Eliminar la película
    await Pelicula.findByIdAndDelete(req.params.id);

    // Desvincular todas las salas relacionadas
    await Sala.updateMany(
      { pelicula: pelicula._id },
      { $unset: { pelicula: "" } } // Elimina el campo película de las salas
    );

    res.status(200).send({ message: 'Película eliminada con éxito' });
    
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Obtener TODAS las peliculas
app.get('/peliculas', async (req, res) => {
  try {
    const peliculas = await Pelicula.find().populate('salas');

    if (!peliculas) return res.status(404).json({ message: 'Película no encontrada' });

    res.json(peliculas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener películas', error });
  }
});


// Obtener una película específica por ID
app.get('/peliculas/:id', async (req, res) => {
  try {
    const pelicula = await Pelicula.findById(req.params.id).populate('salas');
    if (!pelicula) return res.status(404).json({ message: 'Película no encontrada' });
    res.json(pelicula);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener película', error });
  }
});

// CRUD para Horario

// Crear un nuevo horario
app.post('/horarios', async (req, res) => {
  const { sala, hora } = req.body;

  // Verifica que se proporcionen los campos requeridos
  if (!sala || !hora) {
    return res.status(400).json({ message: 'Los campos hora y id de sala son obligatorios' });
  }

  console.log(req.body); // Para verificar los datos recibidos

  const nuevoHorario = new Horario({ sala, hora });

  try {
    const horarioGuardado = await nuevoHorario.save();

    // Vincular el horario a la sala
    await Sala.findByIdAndUpdate(sala, { $push: { horarios: horarioGuardado._id } });

    res.status(201).json(horarioGuardado);
  } catch (error) {
    res.status(400).json({ message: 'Error al crear el horario', error });
  }
});

// Obtener todos los horarios
app.get('/horarios', async (req, res) => {
  try {
    const horarios = await Horario.find().populate('sala');
    res.json(horarios);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los horarios', error });
  }
});

// Obtener un horario específico por ID
app.get('/horarios/:id', async (req, res) => {
  try {
    const horario = await Horario.findById(req.params.id).populate('sala');
    if (!horario) return res.status(404).json({ message: 'Horario no encontrado' });
    res.json(horario);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener horario', error });
  }
});

// Actualizar un horario
app.put('/horarios/:id', async (req, res) => {
  try {
    const horarioActualizado = await Horario.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!horarioActualizado) return res.status(404).json({ message: 'Horario no encontrado' });
    res.json(horarioActualizado);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar el horario', error });
  }
});

// Eliminar un horario
app.delete('/horarios/:id', async (req, res) => {
  try {
    const horario = await Horario.findById(req.params.id);
    if (!horario) {
      return res.status(404).json({ message: 'Horario no encontrado' });
    }

    // Desvincular el horario de la sala
    await Sala.findByIdAndUpdate(horario.sala, { $pull: { horarios: horario._id } });

    // Eliminar el horario
    await Horario.findByIdAndDelete(req.params.id);

    res.status(200).send({ message: 'Horario eliminado con éxito' });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//OTRAS RUTAS

//Peticion especial para listar peliculas con sus salas y horarios
app.get('/peliculas-con-salas-y-horarios', async (req, res) => {
  try {
    const peliculas = await Pelicula.find().populate({
      path: 'salas',
      populate: { path: 'horarios' }
    });
    res.json(peliculas);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las películas con salas y horarios', error });
  }
});

// Ruta para obtener horarios con detalles de cine y sala
app.get('/horarios-con-detalles', async (req, res) => {
  try {
      const horarios = await Horario.find()
          .populate({
              path: 'sala', // Poblamos la sala
              populate: [
                  {
                      path: 'cine' // Poblamos el cine dentro de la sala
                  },
                  {
                      path: 'pelicula' // Poblamos la película dentro de la sala
                  }
              ]
          });
      
      res.json(horarios); // Devolver los horarios como respuesta en formato JSON
  } catch (error) {
      console.error('Error al obtener los horarios:', error);
      res.status(500).json({ error: 'Error al obtener los horarios' }); // Manejo de errores
  }
});

app.get('/cines-con-salas-peliculas-y-horarios', async (req, res) => {
  try {
      const cines = await Cine.find()
          .populate({
              path: 'salas',
              populate: [
                  { path: 'pelicula' },
                  { path: 'horarios' }
              ]
          });
      res.json(cines);
  } catch (error) {
      console.error('Error al obtener los cines:', error.message); // Muestra el error específico
      res.status(500).json({ message: 'Error al obtener los cines' });
  }
});

app.get('/salas/:salaId/pelicula/:peliculaId', async (req, res) => {
  const { salaId, peliculaId } = req.params;
  try {
    const sala = await Sala.findById(salaId).populate('pelicula');
    if (sala && sala.pelicula && sala.pelicula._id.toString() === peliculaId) {
      return res.json(sala.pelicula);
    }
    res.status(404).json({ message: 'Película no encontrada en la sala' });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});