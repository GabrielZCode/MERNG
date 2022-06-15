const { gql } = require('graphql-tag')
module.exports = typeDefs = gql`
  type Query{
    sayhi: String!,
    getPosts: [Post],
    getPost(postId: ID!): Post
  }

type User{
  id: ID,
  email: String!,
  token: String!,
  username: String!,
  createdAt: String! 
}

type Post{
  id: ID!,
  body: String!,
  username: String!,
  createdAt: String!,
  comments: [Comment],
  likes: [Like],
  likeCount: Int!,
  commentCount: Int!
}

type Comment {
 id: ID,
 createdAt: String,
 username: String,
 body: String
 
}
type Like{
 id: ID,
 createdAt: String,
 username: String
}
input  RegisterInput{
    username: String!,
    email: String!
    password: String!,
    confirmpassword: String!,
    userType: String! 
}

type Mutation{
  register(registerInput: RegisterInput): User,
  login(email: String!,password: String!): User,
  createPost(body: String!): Post!,
  deletePost(postId: ID!): String!,
  createComment(postId: ID!,body: String!): Post!,
  deleteComment(postId: ID!, commentId: ID!): Post!,
  likePost(postId: ID!): Post!
}
type Subscription{
 newPost: Post!
}
`;

