const xss = require('xss')

const EntityService = {
  getAllEntitiesByClientId(db, clientId) {
    return db
      .select('*')
      .from('entities')
      .where('client_id', clientId)
  },
  insertEntity(db, newEntity) {
    return db
      .insert(newEntity)
      .into('entities')
      .returning('*')
      .then(rows => rows[0])
  },
  insertParentToSub(db, data) {
    return db
      .insert(data)
      .into('parent_to_sub')
      .returning('*')
      .then(rows => rows[0])
  },
  updateEntity(db, updatedEntity) {
    return db('entities')
      .where('entity_id', updatedEntity.entity_id)
      .update({
        active: updatedEntity.data
      })
      .returning('*')
  },
  deleteEntity(db, entityId) {
    return db
      .from('entities')
      .where('entity_id', entityId)
      .del()
  },
  serializeEntity(entity) {
    return {
      clientId: entity.client_id,
      entityId: entity.entity_id,
      entityName: entity.legal_name,
      ein: entity.ein,
      filer: entity.filer,
      entityType: entity.entity_type,
      active: entity.active
    }
  }
}

module.exports = EntityService