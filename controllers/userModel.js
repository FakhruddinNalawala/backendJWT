import mongoose, {
    Schema
} from 'mongoose';

/**
 * Create database scheme for users
 */
const UserSchema = new Schema({
    userID:
    {
        type: String,
        required,
        unique
    },
    username: {
        type: String,
        required,
        unique
    },
    email: {
        type: String,
        required,
        unique
    },
    password: {
        type: String,
        required
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