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
  //Must change route to be dynamic so I can access client ID to pull correct entities
  // .get((req, res, next) => {
  //   EntitiesService.getAllEntities(req.app.get('db'), req.user)
  //     .then(entities => {
  //       res.status(200).json(entities.map(EntitiesService.SerializeEntities))
  //     })
  // })
  .post(jsonBodyParser, (req, res, next) => {
    const { client_id, legal_name, ein, filer, entity_type, active } = req.body
    const newEntity = { client_id, legal_name, ein, filer, entity_type, active }
    console.log(newEntity)
  
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
          //Must revisit this later. For now will skip building corporate structure
          // let newParentToSub = {}
          // EntityService.insertParentToSub(
          //   req.app.get('db'),
          //   parent to sub data
          // )
          .status(201)
          .json(EntitiesService.serializeEntity(entity))
      })
      .catch(next)
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