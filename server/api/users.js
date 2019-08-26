import _ from 'lodash'

import Router from 'koa-router'
import jwt from 'koa-jwt'

import knex from 'server/utils/knex'
import { ISSUER } from 'server/utils/jwt'

const SECRET = process.env.JWT_SECRET || 'secret'

const router = new Router({
  prefix: '/users'
})

// Load jwt with pass-through.
router.use(jwt({
  issuer: ISSUER,
  secret: SECRET
}))

// GET /api/users/me
router.get('/me', async (ctx) => {
  const { userId } = ctx.state.user

  // Find user by id.
  const user = await knex.from('users').select('*').where({ id: userId }).first()
  if (!user) return

  // Return user information except password.
  ctx.body = _.omit(user, ['password'])
})

export default router
