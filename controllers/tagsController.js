import mongoose from 'mongoose';
import Article from '../models/articleModel';
import Tags from '../models/tagsModel';
import jwt from 'jsonwebtoken';

const jwtKey = 'a_secret_key';
const jwtTimePeriod = 300;

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
        })
        // } 
        // catch (error) {
        //     return res.json(error);
        // }
    }
}