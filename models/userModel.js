import mongoose, {
    Schema
} from 'mongoose';

/**
 * Create database scheme for users
 */
const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    createDate: {
        type: Date,
        default: new Date
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    isDeactivated: {
        type: Boolean,
        default: false
    }
});

export default mongoose.model('User', UserSchema);