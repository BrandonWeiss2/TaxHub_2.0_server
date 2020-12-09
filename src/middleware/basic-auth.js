const AuthService = require('../auth/auth-service')

function requireAuth(req, res, next) {
  const authToken = req.get('Authorization') || ''

  let basicToken
  if(!authToken.toLowerCase().startsWith('basic')) {
    return res.status(401).json({ error: 'Missing basic token'})
  } else {
    basicToken = authToken.slice('basic '.length, authToken.length)
  }

  const [tokenUserName, tokenPassword] = AuthService.parseBasicToken(basicToken)
  
  if (!tokenUserName || !tokenPassword) {
    return res.status(401).json({ error: 'Unauthorized request' })
  }

  AuthService.getUserWithUsername(
    req.app.get('db'),
    tokenUserName
  )
    .then(user => {
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized Request' })
      }

      return AuthService.comparePasswords(tokenPassword, user.password)
        .then(passwordsMatch => {
          if (!passwordsMatch) {
            return res.status(401).json({ error: 'Unauthorized request' })
          }

          req.user = user
          next()
        })
    })
    .catch(next)
  }

module.exports = {
  requireAuth,
}