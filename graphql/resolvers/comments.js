const { UserInputError, AuthenticationError } = require('apollo-server')
const Post = require('../../Models/Post')
const checkAuth = require('../../util/check-auth')
module.exports = {
  Mutation: {
    createComment: async (_, { body, postId }, context) => {
      const user = checkAuth(context)

      if (body.trim() === "") {
        throw new UserInputError('Empty Comment', {
          errors: {
            body: 'Comment must not be empty'
          }
        })
      }
      const post = await Post.findById(postId)
      if (post) {
        post.comments.unshift({
          body,
          username: user.username,
          createdAt: new Date().toISOString()
        })
        await post.save()
        return post;
      } else throw new UserInputError('Post not Found')
    },
    deleteComment: async (_, { postId, commentId }, context) => {
      const { username, userType } = checkAuth(context)

      const post = await Post.findById(postId);
      if (post) {
        const index = post.comments.findIndex(c => c.id === commentId);

        if (post.comments[index].username === username) {
          post.comments.splice(index, 1)
          await post.save();
          return post
        } else throw new AuthenticationError('Action not allowed')
      } else {
        throw new UserInputError('Post not Found')
      }
    },
    async likePost(_, { postId }, context) {
      const { username } = checkAuth(context)

      const post = await Post.findById(postId)

      if (post) {
        if (post.likes.find(like => like.username === username)) {
          post.likes = post.likes.filter(like => like.username !== username)
        } else {
          post.likes.push({
            username,
            createdAt: new Date().toISOString()
          })
        }
        await post.save()
        return post
      } else throw new UserInputError('Post not Found')
    }
  }
}
