import mongoose from 'mongoose';
import User from '../models/userModel';
import jwt from 'jsonwebtoken';

const jwtKey = 'a_secret_key';
const jwtTimePeriod = 600;

module.exports = {

    create: async (req, res) => {
        // try {

        // Check if user is new
        let user = await User.findOne({ username: req.body.username });
        if (user) return res.status(200).send({ 'error': 'Username taken', 'user': user });

        user = await User.findOne({ email: req.body.email });
        if (user) return res.status(200).send({ 'error': 'Email taken', 'user': user });

        let insertDetails = req.body;
        insertDetails.isAdmin = false;
        insertDetails.isDeactivated = false;

        const createdUser = new User(insertDetails);
        createdUser.save(err => {
            if (err) return res.status(500).send(err);
            return res.status(200).send(createdUser);
        });
        // } 
        // catch (error) {
        //     return res.json(error);
        // }
    },

    assignAdmin: async (req, res) => {
        // try {

        // Verify token before proceeding
        const token = req.cookies.token;
        console.log("Received Token:", token);

        if (!token) {
            console.log('Invalid token');
            return res.status(401).json({ 'status': 'Invalid Token' });
        }

        // Check if admin exists
        let id = req.body.adminID;
        let admin = await User.findById(id);
        if (!admin) return res.status(401).send({ 'error': "Admin Doesn't exist" });
        if (!admin.isAdmin) return res.status(400).send({ 'error': "User is not admin", 'user': admin });

        // Check if user exists
        id = req.body.userID;
        let user = await User.findById(id);
        if (!user) return res.status(200).send({ 'error': "User doesn't exist" });

        User.findByIdAndUpdate(id, { isAdmin: true }, { new: true }, (err, newAdmin) => {
            if (err) return res.status(500).send(err);
            return res.status(200).send({ 'done': 'Updated', 'user': newAdmin });
        })
        // } 
        // catch (error) {
        //     return res.json(error);
        // }
    },

    login: async (req, res) => {
        // try {
        const { username, password } = req.body;

        User.findOne({ username: req.body.username, password: req.body.password }, (err, user) => {
            if (err) return res.status(500).send(err);
            if (!user) return res.status(400).send({ 'Error': 'Invalid credentials' });

            const token = jwt.sign({ username }, jwtKey, {
                algorithm: "HS256",
                expiresIn: jwtTimePeriod,
            });
            console.log("Generated Token", token);

            res.cookie("token", token, { maxAge: jwtTimePeriod * 1000 })
            return res.json({ 'Status': 'Login successful, JSON Web Token Generated' })
        });

    }
    // } 
    // catch (error) {
    //     return res.json(error);
    // }
}