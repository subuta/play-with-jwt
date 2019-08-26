import knex from 'knex'
import connection from '../../knexfile'

const db = knex(connection)

export default db
