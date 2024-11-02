import mongoose from 'mongoose';

const CinemaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  ubicacion: {
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

export default mongoose.model('Cinema', CinemaSchema);
