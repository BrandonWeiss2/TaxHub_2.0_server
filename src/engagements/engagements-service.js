const xss = require('xss')

const EngagementsService = {
  // returns every engagement, the clients related entities and the forms (returns and extensions) associated with those entities. This will join together the engagements table and filing_years tables just to get a basic listing with no additional details
  async getCompleteEngagementData(db, clientId) {
    let engagementList = await this.getEngagementsByClientId(db, clientId)
    console.log('engagementList', engagementList)
    // the array containing the engagements is mapped over
    return await Promise.all(engagementList.map(async engagement => {
      let totalForms = await this.getNumberOfForms(db, engagement.engagement_id, engagement.engagement_type)
      let formsFinalized = await this.getNumberOfFormsFinalized(db, engagement.engagement_id, engagement.engagement_type)
      let entities = await this.getAllEntities(db, clientId)
      // the array containing the entities is mapped over while still in the map for the engagements
      entities = await Promise.all(entities.map( async entity => {
        // every form (tax return or extension) is combined into an array for each entity
        let entityForms = await this.getAllEntityForms(db, entity.entity_id, engagement.engagement_type, engagement.engagement_id)
        let entityTotalForms = 0
        let entityFormsFinalized = 0
        entityForms.forEach(form => {
          entityTotalForms ++
          if (form.completion_status === 'FINAL') {
            entityFormsFinalized++
          }
        })
        return await this.serializeEntityForms(entity, entityForms, entityTotalForms, entityFormsFinalized, engagement.engagement_type)
      }))
      // all the engagments are serialized, and the entities array we previously mapped is combined. This exits the engagement list map and returns the final array of all our data
      return await this.serializeEngagements(engagement, totalForms[0].count, formsFinalized[0].count, entities)
    }))
  },
  updateEngagmentStatus(db, engagementId, engagementStatus) {
    return db('engagements')
      .where('engagement_id', engagementId)
      .update({
        engagement_status: engagementStatus,
      })
      .returning('engagement_status')
  },
  getAllEntities(db, clientId) {
    return db
      .select('*')
      .from('entities')
      .where('client_id', clientId)
  },
  getAllEntityForms(db, entityId, engagementType, engagementId) {
    return db
      .select('*')
      .from('entities')
      .rightJoin(`${engagementType}`, `entities.entity_id`, `${engagementType}.entity_id`)
      .where({
        'engagement_id': engagementId,
        'entities.entity_id': entityId,
      })
  },
  getEngagementsByClientId(db, clientId) {
    return db
      .select('*')
      .from('engagements')
      .fullOuterJoin('filing_years', 'engagements.filing_year_id', 'filing_years.filing_year_id')
      .where('client_id', clientId)
      .whereNotNull('engagement_id')
  },
  getNumberOfForms(db, engagementId, engagementType) {
    return db
      .count('completion_status')
      .from('engagements')
      .rightJoin(`${engagementType}`, `engagements.engagement_id`, `${engagementType}.engagement_id`)
      .where('engagements.engagement_id', engagementId)
  },
  getNumberOfFormsFinalized(db, engagementId, engagementType) {
    return db
      .count('completion_status')
      .from('engagements')
      .rightJoin(`${engagementType}`, `engagements.engagement_id`, `${engagementType}.engagement_id`)
      .where('engagements.engagement_id', engagementId)
      .where(`${engagementType}.completion_status`, 'FINAL') 
  },
  insertNewExtension(db, extension) {
    return db
      .insert(extension)
      .into('extensions')
      .returning('*')
      .then(rows => rows[0])
  },
  updateExtension(db, extension) {
    return db('extensions')
      .where('extension_id', extension.extension_id)
      .update({
        jurisdiction_id: extension.jurisdiction_id,
        form_name: extension.form_name,
        due_date: extension.due_date,
        completion_status: extension.completion_status
      })
      .returning('*')
      .then(rows => {
        let results = rows.find(row => row.extension_id === extension.extension_id)
        return results
      })
  },
  deleteExtension(db, extension_id) {
    return db
      .from('extensions')
      .where('extension_id', extension_id)
      .del()
  },
  serializeExtension(extension) {
    return {
      extensionId: extension.extension_id,
      entityId: extension.entity_id,
      jurisdictionId: extension.jurisdiction_id,
      formName: extension.form_name,
      dueDate: extension.due_date,
      completionStatus: extension.completion_status,
    }
  },
  insertNewTaxReturn(db, taxReturn) {
    return db
      .insert(taxReturn)
      .into('tax_returns')
      .returning('*')
      .then(rows => rows[0])
  },
  updateTaxReturn(db, taxReturn) {
    return db('tax_returns')
      .where('tax_return_id', taxReturn.tax_return_id)
      .update({
        jurisdiction_id: taxReturn.jurisdiction_id,
        form_name: taxReturn.form_name,
        extended: taxReturn.extended,
        due_date: taxReturn.due_date,
        extendedDueDate: taxReturn.extendedDueDate,
        completion_status: taxReturn.completion_status
      })
      .returning('*')
      .then(rows => {
        let results = rows.find(row => row.tax_return_id === taxReturn.tax_return_id)
        return results
      })
  },
  deleteTaxReturn(db, taxReturnId) {
    return db
      .from('tax_returns')
      .where('tax_return_id', taxReturnId)
      .del()
  },
  getAllFilingYearsByClient(db, clientId) {
    return db
      .from('filing_years')
      .where('client_id', clientId)
      .returning('*')
  },
  insertNewFilingYear(db, filingYear) {
    return db
      .insert(filingYear)
      .into('filing_years')
      .returning('*')
      .then(rows => rows[0])
  },
  insertEngagement(db, engagement) {
    return db
      .insert(engagement)
      .into('engagements')
      .returning('*')
      .then(rows => rows[0])
  },
  serializeFilingYear(filingYear) {
    return {
      filingYearId: filingYear.filing_year_id,
      clientId: filingYear.client_id,
      yearEnd: filingYear.year_end,
      filingYear: filingYear.filing_year
    }
  },
  serializeTaxReturn(taxReturn) {
    return {
      taxReturnId: taxReturn.tax_return_id,
      entityId: taxReturn.entity_id,
      jurisdictionId: taxReturn.jurisdiction_id,
      formName: taxReturn.form_name,
      extended: taxReturn.extended,
      dueDate: taxReturn.due_date,
      extendedDueDate: taxReturn.extended_due_date,
      completionStatus: taxReturn.completion_status,
    }
  },
  serializeEngagements(engagement, totalForms, formsFinalized, entities) {
    return {
      clientId: engagement.client_id,
      engagementId: engagement.engagement_id,
      filingYearId: engagement.filing_year_id,
      engagementType: engagement.engagement_type,
      engagementStatus: engagement.engagement_status,
      filingYear: engagement.filing_year,
      yearEnd: engagement.year_end,
      totalForms: totalForms,
      formsFinalized,
      entities,
    }
  },
  serializeEntityForms(entity, entityForms, totalForms, formsFinalized, engagementType) {
    if(engagementType === 'extensions') {
      entityForms = entityForms.map(form => {
        return ({
          extensionId: form.extension_id,
          entityId: form.entity_id,
          jurisdictionId: form.jurisdiction_id,
          formName: form.form_name,
          dueDate: form.due_date,
          completionStatus: form.completion_status,
        })
      })
    } else if (engagementType === 'tax_returns') {
      entityForms = entityForms.map(form => {
        return ({
          taxReturnId: form.tax_return_id,
          entityId: form.entity_id,
          jurisdictionId: form.jurisdiction_id,
          formName: form.form_name,
          extended: form.extended,
          dueDate: form.due_date,
          extendedDueDate: form.extended_due_date,
          completionStatus: form.completion_status,
        })
      })
    }
    return ({
      entityId: entity.entity_id,
      entityName: entity.legal_name,
      clientId: entity.clientId,
      ein: entity.ein,
      filer: entity.filer,
      active: entity.active,
      totalForms: totalForms,
      formsFinalized: formsFinalized,
      entityForms: entityForms
    })
  },
  serializeEngagementEntityForms(engagementType, form) {
    if(engagementType === 'extensions') {
      return ({
        extensionId: form.extension_id,
        entityId: form.entity_id,
        jurisdictionId: form.jurisdiction_id,
        formName: form.form_name,
        dueDate: form.due_date,
        completionStatus: form.completion_status,
      })
    } else if (engagementType === 'tax_returns') {
        return ({
          taxReturnId: form.tax_return_id,
          entityId: form.entity_id,
          jurisdictionId: form.jurisdiction_id,
          formName: form.form_name,
          extended: form.extended,
          dueDate: form.due_date,
          extendedDueDate: form.extended_due_date,
          completionStatus: form.completion_status,
        })
    }
  }
}


module.exports = EngagementsService