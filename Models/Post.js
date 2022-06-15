const { model, Schema } = require('mongoose')

const postSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId, ref: 'users',
    required: true,
  },
  username: {
    type: String,
    required: true
  },

  body: {
    type: String,
    required: true,
  },

  createdAt: {
    type: String,
    required: true
  },

  comments: [{
    body: String,
    username: String,
    createdAt: String
  }],
  likes: [{
    username: String,
    createdAt: String
  }]
})

module.exports = model('Post', postSchema)
