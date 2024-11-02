import mongoose from 'mongoose';

const HorarioSchema = new mongoose.Schema({
  hora: {
    type: String,  // Ejemplo: "16:00"
    required: true
  },
  sala: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Sala',
    required: true
  }
});

export default mongoose.model('Horario', HorarioSchema);
