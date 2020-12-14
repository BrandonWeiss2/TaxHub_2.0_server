const express = require('express')
const path = require('path')
const { Client } = require('pg')
const UsersService = require('./users-service')

const usersRouter = express.Router()
const jsonBodyParser = express.json()

usersRouter
  .route('/users')
  .post(jsonBodyParser, (req, res, next) => {
    const { first_name, last_name, username, user_password } = req.body
    const newUser = { first_name, last_name, username, user_password }
  
    for (const [key, value] of Object.entries(newUser))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })
    
    const passwordError = UsersService.validatePassword(user_password)

    if (passwordError)
      return res.status(400).json({ error: passwordError })

    UsersService.hasUserWithUsername(
      req.app.get('db'),
      username
    )
      .then(user => {
        if (user) 
          return res.status(400).json({ error: 'Username already taken' })
        
        return UsersService.hashPassword(user_password)
          .then(hashedPassword => {
            const newUser = {
              // office_id: 1,
              first_name,
              last_name,
              username,
              user_password: hashedPassword,
              // access_level: 1,
            }

            return UsersService.insertUser(
              req.app.get('db'),
              newUser
            )
              .then(user => {
                res 
                  .status(201)
                  .location(path.posix.join(req.originalUrl, `/${user.id}`))
                  .json(UsersService.serializeUser(user))
              })
          })
        })
        .catch(next)
  })
  
module.exports = usersRouter