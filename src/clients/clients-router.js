const express = require('express')
const path = require('path')
const { Client } = require('pg')
const ClientService = require('./clients-service')
const { requireAuth } = require('../middleware/jwt-auth')

const clientsRouter = express.Router()
const jsonBodyParser = express.json()

clientsRouter
  .route('/clients')
  .all(requireAuth)
  .get((req, res, next) => {
    ClientService.getAllClients(req.app.get('db'), req.user)
      .then(clients => {
        res.status(200).json(clients.map(ClientService.SerializeClients))
      })
  })
//   .post(jsonBodyParser, (req, res, next) => {
//     const { company_name, entity_type, year_end } = req.body
//     const newClient = { company_name, entity_type, year_end }
  
//     for (const [key, value] of Object.entries(newClient))
//       if (value == null)
//         return res.status(400).json({
//           error: `Missing '${key}' in request body`
//         })

//     newClient.user_id = req.user.id
  
//     ClientService.insertClient(
//       req.app.get('db'),
//       newClient
//     )
//       .then(client => {
//         res
//           .status(201)
//           .json(ClientService.SerializeClients(client))
//       })
//       .catch(next)
//   })

// clientsRouter
//   .route('/clients/:id')
//   .all(requireAuth)
//   .delete((req, res, next) => {
//     ClientService.deleteClient(
//       req.app.get('db'), req.params.id
//     )
//       .then(client => {
//         res.status(204).end()
//       })
//       .catch(next)
//     })
    
module.exports = clientsRouter