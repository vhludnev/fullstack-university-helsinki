const mongoose = require('mongoose')

const commentsSchema = new mongoose.Schema({
  title: String,
})

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    minLength: [3, '"{VALUE}" is shorter than the minimum allowed length (3).'],
    required: [true, 'Title is required'],
  },
  author: String,
  url: { type: String, required: [true, 'Url is required'] },
  likes: { type: Number, default: 0 },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  comments: [commentsSchema],
})

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

module.exports = mongoose.model('Blog', blogSchema)
