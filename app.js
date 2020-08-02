import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import jwt from 'jsonwebtoken';

import routes from './routes/index.js';

// The routes of the APIs
const app = express();

// Connect to the MondoDB Database
mongoose.connect('mongodb://localhost/backend');

// Middleware

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

// catch 400
app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(400).send(`Error: ${res.originUrl} not found`);
    next();
});

// catch 500
app.use((err, req, res, next) => {
    console.log(err.stack)
    res.status(500).send(`Error: ${err}`);
    next();
});

// Registering Routes
routes(app);

export default app;