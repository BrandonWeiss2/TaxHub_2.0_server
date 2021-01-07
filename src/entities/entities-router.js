const express = require('express')
const path = require('path')
const EntitiesService = require('./entities-service')
const { requireAuth } = require('../middleware/jwt-auth')
const EntityService = require('./entities-service')

const entitiesRouter = express.Router()
const jsonBodyParser = express.json()

entitiesRouter
  .route('/entities')
  // .all(requireAuth)
  .post(jsonBodyParser, (req, res, next) => {
    const { client_id, legal_name, ein, filer, entity_type, active } = req.body
    const newEntity = { client_id, legal_name, ein, filer, entity_type, active }  
    for (const [key, value] of Object.entries(newEntity))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })
    EntitiesService.insertEntity(
      req.app.get('db'),
      newEntity
    )
      .then(entity => {
        res
          .status(201)
          .json(EntitiesService.serializeEntity(entity))
      })
      .catch(next)
  })
  .patch(jsonBodyParser, (req, res, next) => {
    const { entity_id, data } = req.body
    const updatedEntity = { entity_id, data }  
    for (const [key, value] of Object.entries(updatedEntity))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })

    EntitiesService.updateEntity(req.app.get('db'), updatedEntity)
      .then(entity => {
        res
          .status(201)
          .json(EntitiesService.serializeEntity(entity[0]))
      })
      .catch(next)
  })
  .delete(jsonBodyParser, (req, res, next) => {
    const { entity_id } = req.body
    console.log('entity Id', entity_id)
    EntitiesService.deleteEntity(req.app.get('db'), entity_id)
      .then(entity => {
        res
          .status(201)
          .json(entity_id)
      })
      .catch(next)
  })

entitiesRouter
  .route('/entities/:clientId')
  // .all(requireAuth)
  .get((req, res, next) => {
    EntitiesService.getAllEntitiesByClientId(req.app.get('db'), req.params.clientId)
      .then(entities => {
        let entityList = entities.map(entity => {
          return EntitiesService.serializeEntity(entity)
        })
        res.status(200).json(entityList)
      })
  })

// entitiesRouter
//   .route('/clients/:id')
//   .all(requireAuth)
//   .delete((req, res, next) => {
//     EntitiesService.deleteClient(
//       req.app.get('db'), req.params.id
//     )
//       .then(client => {
//         res.status(204).end()
//       })
//       .catch(next)
//     })
    
module.exports = entitiesRouter