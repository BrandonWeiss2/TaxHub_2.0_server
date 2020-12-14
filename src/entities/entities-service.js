const xss = require('xss')

const EntityService = {
  getAllEntities(db, clientId) {
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
  // deleteClient(db, id) {
  //   return db
  //     .from('clients')
  //     .where('id', id)
  //     .delete()
  // },
  serializeEntity(entity) {
    return {
      clientId: entity.client_id,
      entityName: entity.legal_name,
      ein: entity.ein,
      filer: entity.filer,
      entityType: entity.entity_type,
      active: entity.active
    }
  }
}

module.exports = EntityService