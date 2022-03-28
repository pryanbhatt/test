const mongoose = require('mongoose');
const PostSchema = new mongoose.Schema({
    postId: {
        required: true,
        type: String,
    },
    createdAt: {
        default: Date.now(),
        type: Date,
    },
    note: {
        required: true,
        type: String,
    },
    userName: {
        required: true,
        type: String,
    },
    audioIds :{
        required: true,
        type: [String],
        
    },
    docIds :{
       required: true,
       type: [String], 
    },
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;