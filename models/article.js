  
const mongoose = require('mongoose')

const articleSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    markdown: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    user : {type : mongoose.Schema.Types.ObjectId , ref : 
      'User'}
})




var Article = mongoose.model('Article', articleSchema)
module.exports = Article;