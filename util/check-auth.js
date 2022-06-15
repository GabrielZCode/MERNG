const jwt = require('jsonwebtoken')
const { TOKEN_KEY } = require('../config')
const { AuthenticationError } = require('apollo-server')
module.exports = (context) => {
  const authHeader = context.req.headers.authorization
  if (authHeader) {
    const token = authHeader.split('Bearer ')[1];
    if (token) {
      try {
        const user = jwt.verify(token, TOKEN_KEY)
        return user;
      } catch (err) {
        throw new AuthenticationError('Invalid or Expired Token');
      }
    }
    throw new Error('Authentication token must be valid')
  }
  throw new Error('Authorization Header must be provided')
}
