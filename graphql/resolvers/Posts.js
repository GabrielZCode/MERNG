const { AuthenticationError, UserInputError } = require('apollo-server');
const Post = require('../../Models/Post')
const checkAuth = require('../../util/check-auth')
module.exports = {

  Query: {
    sayhi: () => "hi duude",
    async getPosts() {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (err) {
        throw err
      }
    },
    async getPost(_, { postId }) {
      try {
        const post = await Post.findById(postId)
        if (post) {
          return post
        } else {
          throw new Error('Post not found')
        }
      } catch (err) {
        throw new Error(err)
      }
    }
  },
  Mutation: {
    async createPost(_, { body }, context) {
      const user = checkAuth(context)
      console.log(user)
      if (body.trim() === '') {
        throw new UserInputError('Post Body must not be empty')
      }
      const newPost = new Post({
        body,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString(),
      });

      const post = await newPost.save()
      context.pubsub.publish('NEW_POST', {
        newPost: post
      })
      return post
    },
    async deletePost(_, { postId }, context) {
      const user = checkAuth(context)
      try {
        const post = await Post.findById(postId)
        if (user.username === post.username) {
          await post.delete();
          return 'Post Deleted'
        } else {
          throw new AuthenticationError('Action not llowed')
        }
      } catch (err) {
        throw new Error(err)
      }
    }
  },
  Subscription: {
    newPost: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_POST')
    }
  }
}
