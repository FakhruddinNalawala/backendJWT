import mongoose, {
    Schema
} from 'mongoose';

import TopicSchema from './topicModel';
import UserSchema from './userModel';

/**
 * Create database scheme for Articles
 */
const ArticleSchema = new Schema({
    articleID: {
        type: String,
        required,
        unique
    },
    topicID: {
        type: TopicSchema,
        required
    },
    creatorID: {
        type: UserSchema,
        required
    },
    title: {
        type: String,
        required
    },
    image: {
        type: String
    },
    content: {
        type: String,
        required
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    tags: {
        type: [String]
    },
    viewCount: {
        type: Number,
        default: 0
    },
    createDate: {
        type: Date,
        default: new Date
    },
    isDeactivated: {
        type: Boolean,
        default: false
    }
});

export default mongoose.model('Article', ArticleSchema);