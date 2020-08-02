import mongoose from 'mongoose';
import Article from '../models/articleModel';
import Tags from '../models/tagsModel';
import User from '../models/userModel';
import jwt from 'jsonwebtoken';

function viewCountUpdater(articles) {
    // Updating viewCount
    articles.articleID.forEach(element => {
        const viewCount = element.viewCount + 1;
        // console.log(element._id, viewCount);
        Article.findByIdAndUpdate(element._id, { viewCount: viewCount }, { new: true }, (err, viewed) => {
            // This helps forcibly update viewCount
        });
        element.viewCount = viewCount;
    });
}

function filterFeatured(articles) {
    let output = []
    articles.articleID.forEach(element => {
        if (!element.isFeatured) {
            output.push(element);
        }
    });
    return output;
}

function sortBy(key) {

    return function innerSort(a, b) {
        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
            // property doesn't exist on either object
            return 0;
        }

        const varA = (typeof a[key] === 'string')
            ? a[key].toUpperCase() : a[key];
        const varB = (typeof b[key] === 'string')
            ? b[key].toUpperCase() : b[key];

        let comparison = 0;
        if (varA > varB) {
            comparison = 1;
        } else if (varA < varB) {
            comparison = -1;
        }
        return comparison;
    };
}

module.exports = {

    create: async (req, res) => {

        // Check if admin exists
        let id = req.body.adminID;
        let admin = await User.findById(id);
        if (!admin) return res.status(401).send({ 'error': "Admin Doesn't exist" });
        if (!admin.isAdmin) return res.status(400).send({ 'error': "User is not admin", 'user': admin });
        // try {

        let tagName = req.body.tagName;

        // Check if tagname is already in use
        let tag = await Tags.findOne({ tagName: tagName });
        if (tag) return res.status(401).send({ 'error': 'Tagname exists', 'tag': tag });

        const createdTag = new Tags({ tagName: tagName });
        createdTag.save(err => {
            if (err) return res.status(500).send(err);
            return res.status(200).send(createdTag);
        });
        // } 
        // catch (error) {
        //     return res.json(error);
        // }
    },

    returnTaggedArticles: async (req, res) => {
        // try {

        // Verify topic exists
        let tagName = req.body.tagName;
        Tags.findOne({ tagName: tagName }, (err, tag) => {
            if (err) return res.status(500).send(err);
            if (!tag) return res.status(401).send({ 'error': 'Tag does not exist' });
        }).populate('articleID').exec((err, articles) => {
            if (err) return res.status(500).send(err);

            // Updating viewCount
            viewCountUpdater(articles);
            let output = articles;
            if (req.body.sortBy) {
                output = output.sort(sortBy(req.body.sortByKey));
            }

            // Check if user is logged in
            const token = req.cookies.token;
            console.log("Received Token:", token);

            if (!token) {
                output = filterFeatured(output);
            }
            return res.status(200).send({ 'status': "Returning articles with tag", 'articles': output })
        });
        // } 
        // catch (error) {
        //     return res.json(error);
        // }
    }
}