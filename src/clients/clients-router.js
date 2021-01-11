const express = require('express')
const path = require('path')
const ClientService = require('./clients-service')
const { requireAuth } = require('../middleware/jwt-auth')

const clientsRouter = express.Router()
const jsonBodyParser = express.json()

function isCorrectDateFormat (dateString, format) {
  return (dateString, format, true).isValid()
}

clientsRouter
  .route('/clients')
  .all(requireAuth)
  .get((req, res, next) => {
    ClientService.getAllClients(req.app.get('db'))
      .then(clients => {
        let clientList = clients.map(client => {
          return (
            ClientService.serializeClients(client)
          )
        })
        res.status(200).json(clientList)
      })
  })
  .post(jsonBodyParser, (req, res, next) => {
    const { client_name, entity_type, year_end, client_status } = req.body
    const newClient = { client_name, entity_type, year_end, client_status }
    const userId = req.user.user_id

    if (!client_name || typeof client_name !== 'string') {
      return res.status(400).json({ error: 'Invalid client name' });
    }

    if (!year_end || !isCorrectDateFormat(year_end, 'YYYY-MM-DD')) {
      return res.status(400).json({ error: 'Invalid year-end' });
    }

    ClientService.insertClient(
      req.app.get('db'),
      newClient
    )
      .then(client => {
        let newUserToClient = {user_id: userId, client_id: client.client_id}
        ClientService.insertUserToClients(
          req.app.get('db'), 
          newUserToClient
        )
        res
          .status(201)
          .json(ClientService.serializeClients(client))
      })
      .catch(next)
  })

clientsRouter
  .route('/clients/user')
  .all(requireAuth)
  .get((req, res, next) => {
    ClientService.getClientsByUser(req.app.get('db'), req.user)
      .then(clients => {
        let clientList = clients.map(client => {
          return (
            ClientService.serializeClients(client)
          )
        })
        res.status(200).json(clientList)
      })
      .catch(next)
  })
  .post(jsonBodyParser, (req, res, next) => {
    const { client_id  } = req.body
    let clientToUser = { client_id, user_id: req.user.user_id}
    ClientService.insertUserToClients(req.app.get('db'), clientToUser)
      .then(client => {
        res.status(200).json(ClientService.serializeClients(client))
      })
      .catch(next)
  })

clientsRouter
  .route('/clients/contact')
  .all(requireAuth)
  .patch(jsonBodyParser, (req, res, next) => {
    const { client_id, contact_first_name, contact_last_name, contact_email, contact_phone_number } = req.body
    updatedClientContact = {contact_first_name, contact_last_name, contact_email, contact_phone_number}
    ClientService.updateClientContact(req.app.get('db'), updatedClientContact, client_id)
      .then(client => {
        res.status(200).json(ClientService.serializeClients(client))
      })
      .catch(next)
  })

clientsRouter
  .route('/clients/id/:id')
  .all(requireAuth)
  .get((req, res, next) => {
    ClientService.getClientsByClientId(req.app.get('db'), req.params.id)
      .then(client => {
        console.log(client)
        res.status(200).json(ClientService.serializeClients(client))
      })
      .catch(next)
  })

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