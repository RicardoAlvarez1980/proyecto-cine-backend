import mongoose from 'mongoose';

const PeliculaSchema = new mongoose.Schema({
  titulo: {
    type: String,
    required: true
  },
  director: {
    type: String,
    required: true
  },
  duracion: {
    type: Number,
    required: true
  },
  genero: {
    type: String,
    required: true
  },
  salas: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Sala'
    }
  ]
});

export default mongoose.model('Pelicula', PeliculaSchema);
