const Doctor = require('../models/doctor');

const getAllDoctors = async (req, res, next) => {
    try {
        const doctors = await Doctor.find();
        res.status(200).json(doctors);
    } catch (err) {
        next(err);
    }
};

const registerDoctor = async (req, res, next) => {
    const { name, username, email, password, field, qualification, experience, location, img } = req.body;

    if (!name || !username || !email || !password || !field || !qualification || !experience) {
        if (req.body.responseType === 'redirect') {
            return res.redirect('/doctorRegister?error=MissingFields');
        }
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (password.length < 8) {
        if (req.body.responseType === 'redirect') {
            return res.redirect('/doctorRegister?error=Length');
        }
        return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    try {
        const doctorExists = await Doctor.findOne({ username }).exec();
        if (doctorExists) {
            if (req.body.responseType === 'redirect') {
                return res.redirect('/doctorRegister?error=UsernameTaken');
            }
            return res.status(409).json({ message: 'Username is already taken' });
        }

        const doctor = await Doctor.create({
            name,
            username,
            email,
            password,
            field,
            qualification,
            experience,
            location: location || '',
            img: 'https://via.placeholder.com/150',
            rating: 5.0 // default rating
        });

        if (doctor) {
            req.session.doctor = { id: doctor._id, username: doctor.username, name: doctor.name };

            if (req.body.responseType === 'redirect') {
                return res.redirect('/doctorProfile');
            }

            return res.status(201).json({
                message: 'Doctor registered successfully',
                doctor: { id: doctor._id, name: doctor.name, username: doctor.username, email: doctor.email }
            });
        }
    } catch (err) {
        next(err);
    }
};

const loginDoctor = async (req, res, next) => {
    const { username, password, responseType } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Please provide username and password' });
    }

    try {
        const foundDoctor = await Doctor.findOne({ username, password }).exec();

        if (foundDoctor) {
            req.session.doctor = { id: foundDoctor._id, username: foundDoctor.username, name: foundDoctor.name };

            if (responseType === 'redirect') {
                return res.redirect('/doctorProfile');
            }

            return res.status(200).json({
                message: 'Login successful',
                doctor: { id: foundDoctor._id, name: foundDoctor.name, username: foundDoctor.username }
            });
        } else {
            if (responseType === 'redirect') {
                return res.redirect('/doctorLogin?error=InvalidCredentials');
            }
            return res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (err) {
        next(err);
    }
};

const getDoctorProfile = async (req, res, next) => {
    if (req.session && req.session.doctor) {
        try {
            const doctorData = await Doctor.findById(req.session.doctor.id).select('-password').exec();
            if (doctorData) {
                res.status(200).json({ doctor: doctorData });
            } else {
                res.status(404).json({ message: 'Doctor not found' });
            }
        } catch (err) {
            next(err);
        }
    } else {
        res.status(401).json({ message: 'Not authorized, please log in' });
    }
};

const logoutDoctor = (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            return next(err);
        }
        if (req.method === 'GET' || req.query.responseType === 'redirect') {
            return res.redirect('/doctorLogin');
        }

        res.status(200).json({ message: 'Logout successful' });
    });
};

const updateDoctorProfile = async (req, res, next) => {
    if (!req.session.doctor) {
        return res.status(401).json({ message: 'Not authorized, please log in' });
    }

    const { name, email, field, qualification, experience, location, img } = req.body;

    try {
        const doctor = await Doctor.findById(req.session.doctor.id);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }

        // Update fields if provided
        if (name) doctor.name = name;
        if (email) doctor.email = email;
        if (field) doctor.field = field;
        if (qualification) doctor.qualification = qualification;
        if (experience) doctor.experience = experience;
        if (location !== undefined) doctor.location = location;
        if (img) doctor.img = img;

        await doctor.save();

        res.status(200).json({ message: 'Profile updated successfully', doctor });
    } catch (err) {
        next(err);
    }
};

const findDoctorPage = async (req, res, next) => {
    try {
        const { search, speciality, qualification, location } = req.query;
        const query = {};

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }
        if (speciality) {
            query.field = speciality;
        }
        if (qualification) {
            query.qualification = qualification;
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
    registerDoctor,
    loginDoctor,
    getDoctorProfile,
    logoutDoctor,
    updateDoctorProfile,
};
