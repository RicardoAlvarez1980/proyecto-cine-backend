import mongoose from 'mongoose';

const SalaSchema = new mongoose.Schema({
  numero_sala: {
    type: Number,
    required: true
  },
  butacas: {
    type: Number,
    required: true,
    default: 100
  },
  pelicula: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pelicula'
  },
  horarios: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Horario'
    }
  ],
  cine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cinema',
    required: true
  }
});

export default mongoose.model('Sala', SalaSchema);