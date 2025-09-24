const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  img: { type: String, required: true },
  name: { type: String, required: true },
  field: { type: String, required: true },
  experience: { type: String, required: true },
  qualification: { type: String, required: true },
  rating: { type: Number, required: true }
});

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;
