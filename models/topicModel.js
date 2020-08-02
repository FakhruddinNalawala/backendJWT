import mongoose, {
    Schema
} from 'mongoose';

import ArticleSchema from './articleModel';
import UserSchema from './userModel';

/**
 * Create database scheme for Topics
 */
const TopicSchema = new Schema({
    topicName: {
        type: String,
        required: true,
        unique: true
    },
    topicImage: {
        type: String
    },
    articleID: [{
        type: Schema.Types.ObjectId, 
        ref: 'Article'
    }],
    creatorID: {
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});

export default mongoose.model('Topic', TopicSchema);