const mongoose = require('mongoose');
const Doctor = require('../models/doctor');
const fs = require('fs');
const path = require('path');

const mongoURI = 'mongodb://127.0.0.1:27017/Hospital';

async function importDoctors() {
  try {
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    const dataPath = path.join(__dirname, 'doctorData.json');
    const doctorData = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

    await Doctor.deleteMany({});
    console.log('Cleared existing doctors');

    await Doctor.insertMany(doctorData);
    console.log('Doctor data imported successfully');

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error importing doctor data:', error);
  }
}

if (require.main === module) {
  importDoctors();
}

module.exports = importDoctors;
