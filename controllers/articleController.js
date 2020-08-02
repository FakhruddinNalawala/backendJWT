import mongoose from 'mongoose';
import User from '../models/userModel';
import Topic from '../models/topicModel';
import Tags from '../models/tagsModel';
import Article from '../models/articleModel';
import jwt from 'jsonwebtoken';

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

function viewCountUpdater(articles) {
    // Updating viewCount
    articles.forEach(element => {
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
    articles.forEach(element => {
        if (!element.isFeatured) {
            output.push(element);
        }
    });
    return output;
}

module.exports = {

    create: async (req, res) => {
        // try {

        const token = req.cookies.token;
        console.log("Received Token:", token);

        if (!token) {
            console.log('Invalid token');
            return res.status(401).json({ 'status': 'Invalid Token' });
        }

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
            if (req.body.tags) {
                req.body.tags.forEach(element => {
                    Tags.findOne({ tagName: element }, (err, tag) => {
                        articles = tag.articleID;
                        articles.push(element);
                        Tags.findByIdAndUpdate(tag.id, { articleID: articles }, { new: true }, (err, done) => { });
                    });
                });
            }
        });

        // } 
        // catch (error) {
        //     return res.json(error);
        // }
    },

    update: async (req, res) => {
        // try {

        const token = req.cookies.token;
        console.log("Received Token:", token);

        if (!token) {
            console.log('Invalid token');
            return res.status(401).json({ 'status': 'Invalid Token' });
        }

        // Check if user is Admin
        let updaterID = req.body.updaterID;
        let admin = await User.findById(updaterID);
        if (!admin) return res.status(401).send({ 'error': 'User does not exist' });
        if (!admin.isAdmin) return res.status(401).send({ 'error': 'User is not admin', 'user': admin });

        // 
        let articleID = req.body.articleID;
        let article = await Article.findById(articleID);
        if (!article) return res.status(401).send({ 'error': 'Article does not exist' });
        const oldTags = article.tags;
        const newTitle = req.body.title;
        const newContent = req.body.content;
        const newImage = req.body.image;
        const newFeatured = req.body.isFeatured;
        const newTags = req.body.tags;

        let insertDetails = {};
        if (newTitle) insertDetails["title"] = newTitle;
        if (newContent) insertDetails["content"] = newContent;
        if (newImage) insertDetails["image"] = newImage;
        if (newFeatured) insertDetails["featured"] = newFeatured;
        if (newTags) insertDetails["tags"] = newTags;

        Article.findByIdAndUpdate(articleID, insertDetails, { new: true }, (err, updatedArticle) => {
            if (err) return res.status(500).send(err);
            if (newTags && oldTags && JSON.stringify(newTags) != JSON.stringify(oldTags)) {
                newTags.forEach(element => {
                    if (!oldTags.includes(element)) {
                        console.log('Tag');
                        Tags.findById(element, (err, tag) => {
                            console.log("Updating Tags")
                            let articles = tag.articleID;
                            articles.push(articleID);
                            console.log(articles);
                            Tags.findByIdAndUpdate(tag.id, { articleID: articles }, { new: true }, (err, done) => { });
                        });
                    }
                });
                oldTags.forEach(element => {
                    if (!newTags.includes(element)) {
                        Tags.findOne(element, (err, tag) => {
                            articles = tag.articleID;
                            articles.splice(articles.indexOf(element), 1);
                            Tags.findByIdAndUpdate(tag.id, { articleID: articles }, { new: true }, (err, done) => { });
                        });
                    }
                });
            }
            return res.status(200).send(updatedArticle);
        });
        // } 
        // catch (error) {
        //     return res.json(error);
        // }
    },

    returnAll: async (req, res) => {
        // try {

        Article.find((err, allArticles) => {
            if (err) return res.status(500).send(err);
            viewCountUpdater(allArticles);
            let output = allArticles;

            if (req.body.sortBy) {
                output = output.sort(sortBy(req.body.sortByKey));
            }

            // Check if user is logged in
            const token = req.cookies.token;
            console.log("Received Token:", token);

            if (!token) {
                output = filterFeatured(output);
            }

            return res.status(200).send({ 'done': 'returning all articles', 'articles': output });
        })

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
            viewCountUpdater(allArticles);
            let output = allArticles;
            if (req.body.sortBy) {
                output = output.sort(sortBy(req.body.sortByKey));
            }

            // Check if user is logged in
            const token = req.cookies.token;
            console.log("Received Token:", token);

            if (!token) {
                output = filterFeatured(output);
            }

            return res.status(200).send({ 'done': 'returning all articles', 'articles': output });
        });
        // } 
        // catch (error) {
        //     return res.json(error);
        // }
    },

    returnOne: async (req, res) => {
        // try {

        const token = req.cookies.token;
        console.log("Received Token:", token);

        if (!token) {
            console.log('Invalid token');
            return res.status(401).json({ 'status': 'This article cannot be viewed' });
        }

        // Returning specified topic
        let articleID = req.body.articleID;
        Article.findById(articleID, (err, article) => {
            if (err) return res.status(500).send(err);
            viewCountUpdater([article]);
            let relatedArticles = [];
            article.tags.forEach(tag => {
                Tags.findOne({ tagName }, (err, similarArticles) => {
                    if (err) return res.status(500).send(err);
                    relatedArticles.push(similarArticles);
                })
            })
            if (article) return res.status(200).send({ 'done': 'returning specified article', 'article': article, 'relatedArticles': relatedArticles });
            return res.status(401).send({ 'error': "Article not found" });
        });
        // } 
        // catch (error) {
        //     return res.json(error);
        // }
    },

    generateTree: async (req, res) => {
        Article.find((err, articles) => {
            if (err) return res.status(500).send(err);
            let views = [];
            articles.forEach(article => {
                let id = article._id;
                let viewCount = article.viewCount
                views.push([id, viewCount]);
            });
            console.log(views);
            class Node {
                constructor(id, views) {
                    this.id = id;
                    this.views = views;
                    this.left = null;
                    this.right = null;
                }
            }

            class BinarySearchTree {
                constructor() {
                    // root of a binary seach tree 
                    this.root = null;
                }

                // function to be implemented helper method which creates a new node to be inserted and calls insertNode 
                insert(id, views) {
                    // Creating a node and initailising  with data 
                    var newNode = new Node(id, views);

                    // root is null then node will be added to the tree and made root. 
                    if (this.root === null)
                        this.root = newNode;
                    else

                        // find the correct position in the tree and add the node 
                        this.insertNode(this.root, newNode);
                }

                // Method to insert a node in a tree it moves over the tree to find the location  to insert a node with a given data 
                insertNode(node, newNode) {
                    if (newNode.views < node.views) {
                        if (node.left === null) node.left = newNode;
                        else this.insertNode(node.left, newNode);
                    } else {
                        if (node.right === null) node.right = newNode;
                        else this.insertNode(node.right, newNode);
                    }
                }

                remove(views, id) {
                    // root is re-initialized with root of a modified tree. 
                    this.root = this.removeNode(this.root, views, id);
                }

                // Method to remove node with a given data it recur over the tree to find the data and removes it 
                removeNode(node, views, id) {

                    // if the root is null then tree is empty 
                    if (node === null)
                        return null;

                    // if data to be delete is less than roots data then move to left subtree 
                    else if (views < node.views) {
                        node.left = this.removeNode(node.left, views, id);
                        return node;
                    }

                    // if data to be delete is greater than roots data then move to right subtree 
                    else if (views > node.views) {
                        node.right = this.removeNode(node.right, views, id);
                        return node;
                    }

                    // if data is similar to the root's data then delete this node 
                    else {
                        // deleting node with no children 
                        if (node.left === null && node.right === null) {
                            node = null;
                            return node;
                        }

                        // deleting node with one children 
                        if (node.left === null) {
                            node = node.right;
                            return node;
                        }

                        else if (node.right === null) {
                            node = node.left;
                            return node;
                        }

                        // Deleting node with two children minumum node of the rigt subtree is stored in aux 
                        var aux = this.findMinNode(node.right);
                        node.views = aux.views;

                        node.right = this.removeNode(node.right, aux.views);
                        return node;
                    }

                }

                findMinNode(node) {
                    // if left of a node is null then it must be minimum node 
                    if (node.left === null)
                        return node;
                    else
                        return this.findMinNode(node.left);
                }
            }

            let newTree = new BinarySearchTree;
            views.forEach(element => {
                newTree.insert(element[0], element[1]);
            });
            console.log(newTree);
            return res.status(200).send({ 'Tree': newTree });
        })
        
    }

}