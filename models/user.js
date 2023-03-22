
const mongoose = require('mongoose');
const Conversation = require('./converstaion');
const Message = require('./message')


const userSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avtar: {
        type: String
    },
    homeTown: {
        type: String
    },
    city: {
        type: String
    },
    relationship: {
        type: String
    },
    desc: {
        type: String
    },
    friends: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User'
    },
    conversations: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Conversation'
    }

},
    {
        toJSON: {
            transform(doc, ret) {
                delete ret.password;
            },
        },
    },
    {
        timestamps: true
    })



const User = mongoose.model('User', userSchema);


module.exports = User;