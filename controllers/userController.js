const User = require('../models/user');

const registerUser = async (req, res, next) => {
    const { name, username, email, password, responseType } = req.body;

    if (!name || !username || !email || !password) {
        if (responseType === 'redirect') {
            return res.redirect('/register?error=MissingFields');
        }
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    if (password.length < 8) {
        if (responseType === 'redirect') {
            return res.redirect('/register?error=Length');
        }
        return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    try {
        const userExists = await User.findOne({ username }).exec();
        if (userExists) {
            if (responseType === 'redirect') {
                return res.redirect('/register?error=UsernameTaken');
            }
            return res.status(409).json({ message: 'Username is already taken' });
        }

        const user = await User.create({ name, username, email, password });

        if (user) {
            req.session.user = { id: user._id, username: user.username, name: user.name };
            
            if (responseType === 'redirect') {
                return res.redirect('/'); 
            }
            
            return res.status(201).json({
                message: 'User registered successfully',
                user: { id: user._id, name: user.name, username: user.username, email: user.email }
            });
        }
    } catch (err) {
        next(err);
    }
};

const loginUser = async (req, res, next) => {
    const { username, password, responseType } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Please provide username and password' });
    }

    try {
        const foundUser = await User.findOne({ username, password }).exec();

        if (foundUser) {
            req.session.user = { id: foundUser._id, username: foundUser.username, name: foundUser.name };
            
            if (responseType === 'redirect') {
                return res.redirect('/'); 
            }

            return res.status(200).json({
                message: 'Login successful',
                user: { id: foundUser._id, name: foundUser.name, username: foundUser.username }
            });
        } else {
            if (responseType === 'redirect') {
                return res.redirect('/login?error=InvalidCredentials');
            }
            return res.status(401).json({ message: 'Invalid username or password' });
        }
    } catch (err) {
        next(err);
    }
};

const getUserProfile = async (req, res, next) => {
    if (req.session && req.session.user) {
        try {
            const userData = await User.findById(req.session.user.id).select('-password').exec();
            if (userData) {
                res.status(200).json({ user: userData });
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (err) {
            next(err);
        }
    } else {
        res.status(401).json({ message: 'Not authorized, please log in' });
    }
};

const logoutUser = (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            return next(err);
        }
        if (req.method === 'GET' || req.query.responseType === 'redirect') {
            return res.redirect('/login');
        }

        res.status(200).json({ message: 'Logout successful' });
    });
};

const purchaseMedicines = async (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Not authorized, please log in' });
    }

    const { medicines } = req.body;
    if (!medicines || !Array.isArray(medicines) || medicines.length === 0) {
        return res.status(400).json({ message: 'No medicines provided' });
    }

    try {
        const user = await User.findById(req.session.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Aggregate purchased medicines: if same name exists, add quantity and price
        medicines.forEach(newMed => {
            const existing = user.purchasedMedicines.find(med => med.name === newMed.name);
            if (existing) {
                existing.quantity += newMed.quantity;
                existing.price += newMed.price; // assuming price is total for quantity
                existing.date = new Date(); // update date to latest
            } else {
                user.purchasedMedicines.push(newMed);
            }
        });

        // Limit to 10 entries, remove oldest if exceeds
        if (user.purchasedMedicines.length > 10) {
            user.purchasedMedicines = user.purchasedMedicines.slice(-10); // keep last 10 (most recent)
        }

        await user.save();

        res.status(200).json({ message: 'Medicines purchased successfully' });
    } catch (err) {
        next(err);
    }
};

const clearPurchasedMedicines = async (req, res, next) => {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Not authorized, please log in' });
    }

    try {
        const user = await User.findById(req.session.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.purchasedMedicines = [];
        await user.save();

        res.status(200).json({ message: 'All purchased medicines cleared successfully' });
    } catch (err) {
        next(err);
    }
};

const resetPassword = async (req, res, next) => {
    const { email, newPassword, confirmPassword, responseType } = req.body;

    if (newPassword !== confirmPassword) {
        if (responseType === 'redirect') {
            return res.redirect('/reset?error=PasswordMismatch');
        }
        return res.status(400).json({ message: 'Passwords do not match' });
    }
    if (newPassword.length < 8) {
        if (responseType === 'redirect') {
            return res.redirect('/reset?error=Length');
        }
        return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    try {
        const foundUser = await User.findOne({ email }).exec();
        if (!foundUser) {
            if (responseType === 'redirect') {
                return res.redirect('/reset?error=UserNotFound');
            }
            return res.status(404).json({ message: 'User with that email not found' });
        }

        foundUser.password = newPassword;
        await foundUser.save();

        if (responseType === 'redirect') {
            return res.redirect('/login?success=PasswordReset');
        }

        res.status(200).json({ message: 'Password has been reset successfully' });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    logoutUser,
    purchaseMedicines,
    clearPurchasedMedicines,
    resetPassword,
};
