import mongoose, {
    Schema
} from 'mongoose';

import ArticleSchema from './articleModel';

/**
 * Create database scheme for Topics
 */
const TagsSchema = new Schema({
    tagName: {
        type: String,
        required: true,
        unique: true
    },
    articleID: [{
        type: Schema.Types.ObjectId, 
        ref: 'Article'
    }]
});

export default mongoose.model('Tags', TagsSchema);