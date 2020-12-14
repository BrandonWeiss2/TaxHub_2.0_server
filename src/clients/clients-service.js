const xss = require('xss')

const ClientService = {
  getAllClients(db, user) {
    return db
      .select('*')
      .from('users_to_clients')
      .rightJoin('clients','users_to_clients.client_id', 'clients.client_id')
      .where('user_id', user.user_id)
  },
  insertClient(db, newClient) {
    return db
      .insert(newClient)
      .into('clients')
      .returning('*')
      .then(rows => rows[0])
  },
  insertUserToClients(db, data) {
    return db
      .insert(data)
      .into('users_to_clients')
      .returning('*')
      .then(rows => rows[0])
  },
  // deleteClient(db, id) {
  //   return db
  //     .from('clients')
  //     .where('id', id)
  //     .delete()
  // },
  serializeClients(client) {
    return {
      clientId: client.client_id,
      clientName: client.client_name,
      entityType: client.entity_type,
      yearEnd: client.year_end,
      status: client.client_status
    }
  }
}

module.exports = ClientService