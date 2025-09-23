const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
app.set("view engine", "ejs");
const PORT = 8080;

const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const allowCors = require('./middlewares/cors');
const session = require('express-session');
const helmetMiddleware = require('./middlewares/helmet');
const compression = require('compression');
const { morganLogger, devLogger } = require('./middlewares/morgan');

const pageRoutes = require('./routes/pageRoutes');
const userRoutes = require('./routes/userRoutes');
const doctorRoutes = require('./routes/doctorRoutes');

const mongoURI = 'mongodb://127.0.0.1:27017/Hospital';
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.use(session({
  secret: '945138',
  resave: false,
  saveUninitialized: false,
}));
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logger);
app.use(express.static(path.join(__dirname, 'public')));
app.use(allowCors);
app.use(helmetMiddleware);
app.use(morganLogger);
app.use(devLogger);

app.use('/api/users', userRoutes);
app.use('/api/doctors', doctorRoutes);

app.use('/', pageRoutes);

app.use((req, res, next) => {
  res.status(404).send('Page Not Found');
});

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});