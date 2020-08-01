import mongoose, {
    Schema
} from 'mongoose';

import ArticleSchema from './articleModel';
import UserSchema from './userModel';

/**
 * Create database scheme for Topics
 */
const TopicSchema = new Schema({
    topicID: {
        type: String,
        required,
        unique
    },
    topicName: {
        type: String,
        required,
        unique
    },
    topicImage: {
        type: String
    },
    articleID: {
        type: [ArticleSchema]
    },
    creatorID: {
        type: UserSchema,
        required
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});

export default mongoose.model('Topic', TopicSchema);