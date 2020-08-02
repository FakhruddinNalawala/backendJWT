import mongoose from 'mongoose';
import User from '../models/userModel';
import Topic from '../models/topicModel';
import Article from '../models/articleModel';
import jwt from 'jsonwebtoken';

mongoose.set('useFindAndModify', false);

const jwtKey = 'a_secret_key';
const jwtTimePeriod = 300;

module.exports = {

    create: async (req, res) => {
        // try {

        // const token = req.cookies.token;
        // console.log("Received Token:", token);

        // if (!token) {
        //     console.log('Invalid token');
        //     return res.status(401).json({ 'status': 'Invalid Token' });
        // }

        // Check if user is Admin
        let creatorID = req.body.creatorID;
        let admin = await User.findById(creatorID);
        if (!admin) return res.status(401).send({ 'error': 'User does not exist' });
        if (!admin.isAdmin) return res.status(401).send({ 'error': 'User is not admin', 'user': admin });

        // Check if topic exists
        let topicID = req.body.topicID;
        let topic = await Topic.findById(topicID);
        if (!topic) return res.status(401).send({ 'error': 'Topic does not exist' });

        let articleDetails = req.body;

        const createdArticle = new Article(articleDetails);
        createdArticle.save(err => {
            if (err) return res.status(500).send(err);
            topic.articleID.push(createdArticle);
            Topic.findByIdAndUpdate(topicID, topic, { new: true }, (err, topic) => {
                if (err) return res.status(500).send(err);
                return res.status(200).send({ 'article': createdArticle, 'topic': topic });
            })
        });

        // } 
        // catch (error) {
        //     return res.json(error);
        // }
    },

    update: async (req, res) => {
        // try {

        // const token = req.cookies.token;
        // console.log("Received Token:", token);

        // if (!token) {
        //     console.log('Invalid token');
        //     return res.status(401).json({ 'status': 'Invalid Token' });
        // }

        // Check if user is Admin
        let updaterID = req.body.updaterID;
        let admin = await User.findById(updaterID);
        if (!admin) return res.status(401).send({ 'error': 'User does not exist' });
        if (!admin.isAdmin) return res.status(401).send({ 'error': 'User is not admin', 'user': admin });

        // 
        let articleID = req.body.articleID;
        let article = await Article.findById(articleID);
        if (!article) return res.status(401).send({ 'error': 'Article does not exist' });
        const newTitle = req.body.title;
        const newContent = req.body.content;
        const newImage = req.body.image;
        const newFeatured = req.body.isFeatured;

        Article.findByIdAndUpdate(articleID, { title: newTitle, content: newContent, image: newImage, isFeatured: newFeatured }, { new: true }, (err, updatedArticle) => {
            if (err) return res.status(500).send(err);
            return res.status(200).send(updatedArticle);
        });
        // } 
        // catch (error) {
        //     return res.json(error);
        // }
    },

    returnTopic: async (req, res) => {
        // try {

        // Verify topic exists
        let topicID = req.body.topicID;
        let topic = await Topic.findById(topicID);
        if (!topic) return res.status(401).send({ 'error': 'Topic does not exist' });

        // Returning all articles
        let searchTopicID = req.body.topicID;
        Article.find({ topicID: searchTopicID }, (err, allArticles) => {
            if (err) return res.status(500).send(err);
            return res.status(200).send({ 'done': 'returning all articles', 'articles': allArticles });
        });
        // } 
        // catch (error) {
        //     return res.json(error);
        // }
    },

    returnTag: async (req, res) => {
        // try {

        // Verify tag exists
        let tagID = req.body.tagID;
        let tag = await Topic.findById(tagID);
        if (!tag) return res.status(401).send({ 'error': 'Tag does not exist' });

        // Returning specified articles
        let id = req.body.topicID;
        Tag.findById(id, (err) => {
            if (err) return res.status(500).send(err);
        }).populate('articleID').exec((err, articles) => {
            if (err) return res.status(500).send(err);
            if (articles) return res.status(200).send({ 'done': 'returning specified articles', 'articles': articles });
            return res.status(401).send({ 'error': "No articles found" });
        });
        // } 
        // catch (error) {
        //     return res.json(error);
        // }
    },

    returnOne: async (req, res) => {
        // try {

        // Returning specified topic
        let articleID = req.body.articleID;
        Article.findById(articleID, (err, article) => {
            if (err) return res.status(500).send(err);
            if (article) return res.status(200).send({ 'done': 'returning specified article', 'topics': article });
            return res.status(401).send({ 'error': "Article not found" });
        });
        // } 
        // catch (error) {
        //     return res.json(error);
        // }
    }
}