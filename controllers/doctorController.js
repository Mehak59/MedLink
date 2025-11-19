const Doctor = require('../models/doctor');
// ADDED: Import the bcrypt library for password hashing
const bcrypt = require('bcrypt');
const Appointment = require('../models/appointment');
const DoctorSlot = require('../models/doctorSlot');

const getAllDoctors = async (req, res, next) => {
    try {
        const doctors = await Doctor.find();
        res.status(200).json(doctors);
    } catch (err) {
        next(err);
    }
};

const PendingDoctor = require('../models/pendingDoctor');

const registerDoctor = async (req, res, next) => {
    const { name, username, email, password, specialization, experience, location, phone, hospital, fees, image, availability } = req.body;

    if (!name || !username || !email || !password || !specialization || !experience || !location || !phone || !hospital || !fees || !image || !availability) {
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
        const pendingDoctorExists = await PendingDoctor.findOne({ username }).exec();
        if (pendingDoctorExists) {
            if (req.body.responseType === 'redirect') {
                return res.redirect('/doctorRegister?error=UsernameTaken');
            }
            return res.status(409).json({ message: 'Username is already taken' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const pendingDoctor = await PendingDoctor.create({
            name,
            username,
            email,
            password: hashedPassword,
            specialization,
            experience,
            location,
            phone,
            hospital,
            fees,
            image,
            availability
        });

        if (pendingDoctor) {
            if (req.body.responseType === 'redirect') {
                return res.redirect('/doctorRegister?success=PendingApproval');
            }

            return res.status(201).json({
                message: 'Doctor registration submitted for approval',
                pendingDoctor: { id: pendingDoctor._id, name: pendingDoctor.name, username: pendingDoctor.username, email: pendingDoctor.email }
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
        const foundDoctor = await Doctor.findOne({ username }).exec();

        if (foundDoctor && await bcrypt.compare(password, foundDoctor.password)) {
            req.session.doctor = { id: foundDoctor._id, username: foundDoctor.username, name: foundDoctor.name };

            if (responseType === 'redirect') {
                return res.redirect('/api/doctors/profile');
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
                // Instead of sending JSON, render the dashboard and pass the doctor's data
                res.render('doctorDashboard', { req: req, doctor: doctorData });
            } else {
                res.status(404).json({ message: 'Doctor not found' });
            }
        } catch (err) {
            next(err);
        }
    } else {
        // If not logged in, redirect to the login page
        res.redirect('/doctorLogin');
    }
};

const getDoctorProfileData = async (req, res, next) => {
    if (!req.session.doctor) {
        return res.status(401).json({ message: 'Not authorized, please log in' });
    }

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

const getDoctorsBySpeciality = async (req, res, next) => {
    try {
        const { speciality } = req.query;
        if (!speciality) {
            return res.status(400).json({ message: 'Speciality is required' });
        }

        // FIX: Use a case-insensitive substring search for robustness.
        const doctors = await Doctor.find({ 
            field: { 
                $regex: speciality,  // Substring match
                $options: 'i'        // Case-insensitive
            } 
        });

        res.status(200).json(doctors);
    } catch (err) {
        next(err);
    }
};

const getAvailableSlots = async (req, res, next) => {
    try {
        const { doctor, date } = req.query;
        if (!doctor || !date) {
            return res.status(400).json({ message: 'Doctor and date are required' });
        }

        // Check if slots exist for the date, if not, generate them
        let slots = await DoctorSlot.find({ doctor, date: new Date(date) });

        if (slots.length === 0) {
            // Generate slots from 9am to 5pm in 1-hour intervals
            const startHour = 9;
            const endHour = 17;
            slots = [];
            for (let hour = startHour; hour < endHour; hour++) {
                const time = `${hour}:00`;
                const slot = await DoctorSlot.create({
                    doctor,
                    date: new Date(date),
                    time,
                    available: true
                });
                slots.push(slot);
            }
        }

        // Filter available slots
        const availableSlots = slots.filter(slot => slot.available).map(slot => slot.time);
        res.status(200).json({ slots: availableSlots });
    } catch (err) {
        next(err);
    }
};

const getDoctorAppointments = async (req, res, next) => {
    if (!req.session.doctor) {
        return res.status(401).json({ message: 'Not authorized, please log in' });
    }

    try {
        const appointments = await Appointment.find({ doctor: req.session.doctor.id })
            .populate('user', 'name email')
            .sort({ date: -1, time: -1 });
        res.status(200).json(appointments);
    } catch (err) {
        next(err);
    }
};

const manageSlotAvailability = async (req, res, next) => {
    if (!req.session.doctor) {
        return res.status(401).json({ message: 'Not authorized, please log in' });
    }

    const { id } = req.params;
    const { available } = req.body;

    try {
        const slot = await DoctorSlot.findById(id);
        if (!slot) {
            return res.status(404).json({ message: 'Slot not found' });
        }

        if (slot.doctor.toString() !== req.session.doctor.id) {
            return res.status(403).json({ message: 'Not authorized to manage this slot' });
        }

        slot.available = available;
        await slot.save();

        res.status(200).json({ message: 'Slot availability updated', slot });
    } catch (err) {
        next(err);
    }
};

const getDoctorSlots = async (req, res, next) => {
    if (!req.session.doctor) {
        return res.status(401).json({ message: 'Not authorized, please log in' });
    }

    const { date } = req.query;
    if (!date) {
        return res.status(400).json({ message: 'Date is required' });
    }

    try {
        const slots = await DoctorSlot.find({
            doctor: req.session.doctor.id,
            date: new Date(date)
        });
        res.status(200).json(slots);
    } catch (err) {
        next(err);
    }
};

const getDoctorDashboard = async (req, res, next) => {
    if (req.session && req.session.doctor) {
        try {
            const doctorData = await Doctor.findById(req.session.doctor.id).select('-password').exec();
            if (doctorData) {
                res.render('doctorDashboard', { req: req, doctor: doctorData });
            } else {
                res.status(404).json({ message: 'Doctor not found' });
            }
        } catch (err) {
            next(err);
        }
    } else {
        res.redirect('/doctorLogin');
    }
};

const updateSlotTime = async (req, res, next) => {
    if (!req.session.doctor) {
        return res.status(401).json({ message: 'Not authorized, please log in' });
    }

    const { id } = req.params;
    const { time } = req.body;

    try {
        const slot = await DoctorSlot.findById(id);
        if (!slot) {
            return res.status(404).json({ message: 'Slot not found' });
        }

        if (slot.doctor.toString() !== req.session.doctor.id) {
            return res.status(403).json({ message: 'Not authorized to manage this slot' });
        }

        if (slot.isBooked) {
            return res.status(400).json({ message: 'Cannot change time of a booked slot' });
        }

        slot.time = time;
        await slot.save();

        res.status(200).json({ message: 'Slot time updated successfully', slot });
    } catch (err) {
        next(err);
    }
};

const getUniqueSpecialities = async (req, res, next) => {
    try {
        const specialities = await Doctor.distinct('field');
        res.status(200).json(specialities);
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
    getDoctorProfileData,
    logoutDoctor,
    updateDoctorProfile,
    getDoctorsBySpeciality,
    getAvailableSlots,
    getDoctorAppointments,
    manageSlotAvailability,
    getDoctorSlots,
    getDoctorDashboard,
    updateSlotTime,
    getUniqueSpecialities,
};
