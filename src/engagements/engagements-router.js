const express = require('express')
const path = require('path')
const EngagementsService = require('./engagements-service')
const { requireAuth } = require('../middleware/jwt-auth')

const engagementsRouter = express.Router()
const jsonBodyParser = express.json()

engagementsRouter
  .route('/engagements/:clientId')
  // .all(requireAuth)
  .get((req, res, next) => {
    // EngagementsService.getCompleteEngagementData(req.app.get('db'), req.params.clientId)
    //   .then(engagements => {
    //     res.status(200).json(engagements)
    //   })
    EngagementsService.getEngagementsByClientId(req.app.get('db'), req.params.clientId)
      .then(engagements => {
        let engagementList = engagements.map(engagement => {
          return EngagementsService.serializeEngagement(engagement)
        })
        res.status(200).json(engagementList)
      })
    })

engagementsRouter
  .route('/engagements/:clientId/:engagementId/entities/:engagementType')
  // .all(requireAuth)
  .get((req, res, next) => {
    EngagementsService.getEntitiesByEngagement(req.app.get('db'), req.params.clientId, req.params.engagementId, req.params.engagementType)
      .then(entityList => {
        res.status(200).json(entityList)
      })
    })

engagementsRouter
  .route('/engagements/:clientId/:engagementId/entities/:entityId/engagementType/:engagementType')
  // .all(requireAuth)
  .get((req, res, next) => {
    EngagementsService.getAllEntityForms(req.app.get('db'), req.params.engagementId, req.params.entityId, req.params.engagementType)
      .then(forms => {
        let formList = forms.map(form => {
          return EngagementsService.serializeEntityForms(form, req.params.engagementType)
        })
        console.log('formList', formList)
        res.status(200).json(formList)
      })
    })

engagementsRouter
  .route('/engagements/extensions/:extensionId')
  // .all(requireAuth)
  .get((req, res, next) => {
    EngagementsService.getExtensionById(req.app.get('db'), req.params.extensionId)
      .then(extension => {
        res.status(200).json(extension)
      })
    })

engagementsRouter
  .route('/engagements/taxReturns/:taxReturnId')
  // .all(requireAuth)
  .get((req, res, next) => {
    EngagementsService.getTaxReturnById(req.app.get('db'), req.params.taxReturnId)
      .then(taxReturn => {
        res.status(200).json(taxReturn)
      })
    })

engagementsRouter
  .route('/engagements/:clientId/engagement')
  // .all(requireAuth)
  .post(jsonBodyParser, (req, res, next) => {
    const { filing_year_id, engagement_type, engagement_status } = req.body
    let engagement = {filing_year_id, engagement_type, engagement_status}
    console.log('filingYear' ,  engagement)
    EngagementsService.insertEngagement(req.app.get('db'), engagement)
      .then(engagment => {
        res.status(200).json(engagment)
      })
    })

engagementsRouter
  .route('/engagements/status')
  // .all(requireAuth)
  .patch(jsonBodyParser, (req, res, next) => {
    const { engagement_id, engagement_status } = req.body
    console.log('status' ,  engagement_id, engagement_status)
    EngagementsService.updateEngagmentStatus(req.app.get('db'), engagement_id, engagement_status)
      .then(engagementStatus => {
        res.status(200).json(engagementStatus)
      })
    })

engagementsRouter
  .route('/engagements/extensions')
  // .all(requireAuth)
  .post(jsonBodyParser, (req, res, next) => {
    const { engagement_id, entity_id, jurisdiction_id, form_name, due_date, completion_status } = req.body
    let newExtension = { engagement_id, entity_id, jurisdiction_id, form_name, due_date, completion_status }
    EngagementsService.insertNewExtension(req.app.get('db'), newExtension)
      .then(extension => {
        res.status(200).json(EngagementsService.serializeExtension(extension))
      })
    })
    .patch(jsonBodyParser, (req, res, next) => {
      const { extension_id, jurisdiction_id, form_name, due_date, completion_status } = req.body
      let updateExtension = { extension_id, jurisdiction_id, form_name, due_date, completion_status }
      EngagementsService.updateExtension(req.app.get('db'), updateExtension)
        .then(extension => {
          res.status(200).json(EngagementsService.serializeExtension(extension))
        })
      })
    .delete(jsonBodyParser, (req, res, next) => {
      const { extension_id } = req.body
      EngagementsService.deleteExtension(req.app.get('db'), extension_id)
        .then(extension => {
          res.status(200).json((extension_id))
        })
      })


engagementsRouter
  .route('/engagements/tax_returns')
  // .all(requireAuth)
  .post(jsonBodyParser, (req, res, next) => {
    const { engagement_id, entity_id, jurisdiction_id, form_name, extended, due_date, extended_due_date, completion_status } = req.body
    let newTaxReturn = { engagement_id, entity_id, jurisdiction_id, form_name, extended, due_date, extended_due_date, completion_status }
    EngagementsService.insertNewTaxReturn(req.app.get('db'), newTaxReturn)
      .then(taxReturn => {
        res.status(200).json(EngagementsService.serializeTaxReturn(taxReturn))
      })
    })
    .patch(jsonBodyParser, (req, res, next) => {
      const { tax_return_id, jurisdiction_id, form_name, extended, due_date, extended_due_date, completion_status } = req.body
      let updateTaxReturn = { tax_return_id, jurisdiction_id, form_name, extended, due_date, extended_due_date, completion_status }
      EngagementsService.updateTaxReturn(req.app.get('db'), updateTaxReturn)
        .then(taxReturn => {
          res.status(200).json(EngagementsService.serializeTaxReturn(taxReturn))
        })
      })
    .delete(jsonBodyParser, (req, res, next) => {
      const { tax_return_id } = req.body
      EngagementsService.deleteTaxReturn(req.app.get('db'), tax_return_id)
        .then(taxReturn => {
          res.status(200).json((tax_return_id))
        })
      })
    
  engagementsRouter
  .route('/engagements/:engagementType/:engagementId/:entityId')
  // .all(requireAuth)
  .get((req, res, next) => {
    EngagementsService.getAllEntityForms(req.app.get('db'), req.params.entityId, req.params.engagementType, req.params.engagementId)
      .then(forms => {
        let entityforms = forms.map(form => {
          return(
            EngagementsService.serializeEngagementEntityForms(req.params.engagementType, form)
          )
        })
        res.status(200).json(entityforms)
      })
    })

    engagementsRouter
    .route('/engagements/filingYears/:clientId')
    // .all(requireAuth)
    .get((req, res, next) => {
      EngagementsService.getAllFilingYearsByClient(req.app.get('db'), req.params.clientId)
        .then(filingYears => {
          let clientFilingYears = filingYears.map(filingYear => {
            return(
              EngagementsService.serializeFilingYear(filingYear)
            )
          })
          res.status(200).json(clientFilingYears)
        })
      })
    .post(jsonBodyParser, (req, res, next) => {
      const { client_id, filing_year, year_end } = req.body
      console.log('create filing year', client_id, filing_year, year_end)
      let newFilingYear = { client_id, filing_year, year_end }
      EngagementsService.insertNewFilingYear(req.app.get('db'), newFilingYear)
        .then(filingYear => {
          res.status(200).json(filingYear)
        })
      })
  module.exports = engagementsRouter