import Router from 'koa-router'
import Boom from 'boom'

import knex from 'server/utils/knex'

const router = new Router({
  prefix: '/hb'
})

// GET /api/hb
router.get('/', async (ctx) => {
  // Do simple query for testing database connection.
  try {
    await knex.raw('select 1 as result')
    ctx.body = '💓'
  } catch (err) {
    throw Boom.serverUnavailable(err)
  }
})

export default router
