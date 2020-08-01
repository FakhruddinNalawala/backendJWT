import User from '../controllers/UserController';
import Topic from '../controllers/topicController';
import Article from '../controllers/articleController';

export default (app) => {
    app.route('/newUser').post(User.create);
    app.route('/Admin').post(User.assignAdmin);
    app.route('/login').post(User.login);
    app.route('/newTopic').post(Topic.create);
    app.route('/newArticle').post(Article,create);
    app.route('/updateArticle').post(Article.update);
    app.route('/getTopics').get(Topic.returnAll);
    app.route('/getArticles').get(Article.returnAll);
    app.route('/getTopicID').post(Topic.returnOne);
    app.route('/getArticleID').post(Article.returnOne);
    app.route('/getArticlesTag').post(Article.returnTag);
};