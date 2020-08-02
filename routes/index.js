import User from '../controllers/UserController';
import Topic from '../controllers/topicController';
import Article from '../controllers/articleController';
import Tags from '../controllers/tagsController';

export default (app) => {
    app.route('/signup').post(User.create);
    app.route('/Admin').post(User.assignAdmin);
    app.route('/login').post(User.login);
    app.route('/newTopic').post(Topic.create);
    app.route('/getTopics').get(Topic.returnAll);
    app.route('/getTopicID').post(Topic.returnOne);
    app.route('/newArticle').post(Article.create);
    app.route('/updateArticle').post(Article.update);
    app.route('/getArticleID').post(Article.returnOne);
    app.route('/getArticlesByTag').post(Article.returnTag);
    app.route('/getArticlesByTopic').post(Article.returnTopic);
    app.route('/newTag').post(Tags.create);
};