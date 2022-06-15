
const { ApolloServer, PubSub } = require('apollo-server')
const mongoose = require('mongoose')
const { MONGODB } = require('./config')
const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers/index')

const pubsub = new PubSub();

const PORT = process.env.port || 4000;
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req }) => ({ req, pubsub })
});

async function Connect() {
  await mongoose.connect(MONGODB, {
    useNewUrlParser: true,
    keepAlive: true,
    useUnifiedTopology: true
  }).then(() => {
    console.log('Mongoose Connected')
  }).catch(err => {
    console.error(err)
  })
}

Connect();

server.listen(PORT, () => {
  console.log('server running on  port ', PORT)
})
