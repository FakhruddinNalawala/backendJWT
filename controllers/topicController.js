import mongoose from 'mongoose';
import User from '../models/userModel';
import Topic from '../models/topicModel';
import jwt from 'jsonwebtoken';

module.exports = {

    create: async (req, res) => {
        // try {

        // Verify token before proceeding
        const token = req.cookies.token;
        console.log("Received Token:", token);

        if (!token) {
            console.log('Invalid token');
            return res.status(401).json({ 'status': 'Invalid Token' });
        }

        // Check if user is Admin
        let id = req.body.creatorID;
        let admin = await User.findById(id);
        if (!admin) return res.status(401).send({ 'error': 'User does not exist' });
        if (!admin.isAdmin) return res.status(401).send({ 'error': 'User is not admin', 'user': admin })

        // 
        let topicDetails = req.body;

        const createdTopic = new Topic(topicDetails);
        createdTopic.save(err => {
            if (err) return res.status(500).send(err);
            return res.status(200).send(createdTopic);
        })
        // } 
        // catch (error) {
        //     return res.json(error);
        // }
    },

    returnAll: async (req, res) => {
        // try {

        // Returning all topics
        Topic.find((err, allTopics) => {
            if (err) return res.status(500).send(err);
            return res.status(200).send({ 'done': 'returning all topics', 'topics': allTopics });
        });
        // } 
        // catch (error) {
        //     return res.json(error);
        // }
    },

    returnOne: async (req, res) => {
        // try {

        // Returning specified topic
        let id = req.body.topicID;
        Topic.findById(id, (err, topic) => {
            if (err) return res.status(500).send(err);
            if (topic) return res.status(200).send({ 'done': 'returning specified topic', 'topics': topic });
            return res.status(401).send({ 'error': "Topic not found" });
        });
        // } 
        // catch (error) {
        //     return res.json(error);
        // }
    }
}