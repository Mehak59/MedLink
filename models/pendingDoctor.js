const mongoose = require('mongoose');

const pendingDoctorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    specialization: {
        type: String,
        required: true
    },
    experience: {
        type: Number,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    hospital: {
        type: String,
        required: true
    },
    fees: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    availability: {
        type: String,
        required: true
    }
});

let pendingDoctorModel = new mongoose.model('PendingDoctor', pendingDoctorSchema);

module.exports = pendingDoctorModel;
