import mongoose, {
    Schema
} from 'mongoose';

import TopicSchema from './topicModel';
import UserSchema from './userModel';
import TagsSchema from './tagsModel'

/**
 * Create database scheme for Articles
 */
const ArticleSchema = new Schema({
    topicID: {
        type: Schema.Types.ObjectId, 
        ref: 'Topic',
        required: true
    },
    creatorID: {
        type: Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    image: {
        type: String
    },
    content: {
        type: String,
        required: true
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    tags: [{
        type: Schema.Types.ObjectId, 
        ref: 'Tags'
    }],
    viewCount: {
        type: Number,
        default: 0
    },
    createDate: {
        type: Date,
        default: new Date
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
});

export default mongoose.model('Article', ArticleSchema);