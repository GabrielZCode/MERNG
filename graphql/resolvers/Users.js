const User = require('../../Models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { TOKEN_KEY } = require('../../config')
const { UserInputError } = require('apollo-server')
const { validateRegisterInputs, validateLogin } = require('../../util/validators')


function generateToken(users) {
  return jwt.sign({
    id: users.id,
    email: users.email,
    username: users.username
  },
    TOKEN_KEY, { expiresIn: '1h' })

}

module.exports = {
  Mutation: {
    async login(_, { email, password }) {
      const { valid, errors } = validateLogin(email, password);
      if (valid) {
        throw new UserInputError('Error', { errors })
      }
      const user = await User.findOne({ email })
      if (!user) {
        throw new UserInputError("User not registered")
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        throw new UserInputError('Wrong Credentials', { errors })
      }
      const token = generateToken(user)

      return {
        ...user._doc,
        id: user._id,
        token: token
      }
    },
    async register(_parent, { registerInput: { username, email, password, confirmpassword, userType } }, context, info) {

      const user = await User.findOne({ email })
      if (user) {
        throw new UserInputError('User already exists', {
          errors: {
            username: 'This email is already in use'
          }
        })
      }
      const { valid, errors } = validateRegisterInputs(username, password, confirmpassword, email, userType)
      if (valid) {
        throw new UserInputError(' Errors ', { errors })
      }
      password = await bcrypt.hash(password, 19)
      const newUser = new User({
        email,
        username,
        password,
        userType,
        createdAt: new Date().toISOString()
      })

      const res = await newUser.save();

      const token = generateToken(res)

      return {
        ...res._doc,
        id: res._id,
        token: token
      }
    }
  }
}
