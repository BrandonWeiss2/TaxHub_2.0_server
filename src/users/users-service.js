const xss = require('xss')
const bcrypt = require('bcryptjs')

const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]+/

const UsersService = {
  validatePassword(password) {
    if (password.length < 8) {
      return 'Password must be longer than 8 characters'
    }
    if (password.length > 72) {
      return 'Password must be less than 72 characters'
    }
    if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must not start or end with empty spaces'
    }
  if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
    return 'Password must contain 1 upper case, lower case, number and special character'
  }
  return null
  },
  hasUserWithUsername(db, username) {
    return db('taxhub_users')
      .where({ username })
      .first()
      .then(user => !!user)
  },
  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into('taxhub_users')
      .returning('*')
      .then(([user]) => user)
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12)
  },
  serializeUser(user) {
    return {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      username: user.username,
      password: user.user_password
    }
  }
}

module.exports = UsersService