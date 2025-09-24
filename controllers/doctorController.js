const Doctor = require('../models/doctor');

const getAllDoctors = async (req, res, next) => {
    try {
        const doctors = await Doctor.find();
        res.status(200).json(doctors);
    } catch (err) {
        next(err);
    }
};

const findDoctorPage = async (req, res, next) => {
    try {
        const { search, speciality, qualification } = req.query;
        const query = {};

        if (search) {
            query.name = { $regex: search, $options: 'i' }; 
        }
        if (speciality) {
            query.field = Array.isArray(speciality) ? { $in: speciality } : speciality;
        }
        if (qualification) {
            query.qualification = Array.isArray(qualification) ? { $in: qualification } : qualification;
        }

        const doctors = await Doctor.find(query);

        const specialities = [
            { id: 'general', name: 'General practitioner', icon: 'https://cdn-icons-png.flaticon.com/128/46/46196.png' },
            { id: 'dentistry', name: 'Dentistry', icon: 'https://cdn-icons-png.flaticon.com/128/3467/3467825.png' },
            { id: 'neurology', name: 'Neurology', icon: 'https://cdn-icons-png.flaticon.com/128/9133/9133647.png' },
            { id: 'xray', name: 'X-Ray', icon: 'https://cdn-icons-png.flaticon.com/128/4006/4006101.png' },
            { id: 'dermatology', name: 'Dermatology', icon: 'https://cdn-icons-png.flaticon.com/128/7305/7305176.png' },
            { id: 'urology', name: 'Urology', icon: 'https://cdn-icons-png.flaticon.com/128/2184/2184274.png' },
            { id: 'psychiatry', name: 'Psychiatry', icon: 'https://cdn-icons-png.flaticon.com/128/4637/4637907.png' },
        ];

        res.render('finddoctor', { req, doctors: doctors, specialities });
    } catch (err) {
        next(err);
    }
};
module.exports = {
    getAllDoctors,
    findDoctorPage,
};