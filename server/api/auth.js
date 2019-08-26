import _ from 'lodash'
import Router from 'koa-router'

import passport from 'server/utils/passport'
import jwt from 'server/utils/jwt'

const router = new Router()

// POST /api/auth/login
router.post('/auth/login', (ctx, next) => {
  return passport.authenticate('local', (err, user, info) => {
    if (err) return ctx.throw(500, err)

    if (!user) {
      ctx.status = 401
      ctx.body = _.get(info, 'message', 'UnAuthorized')
      return
    }

    try {
      const token = jwt.sign({ userId: user.id })
      ctx.body = { jwt: token }
    } catch (e) {
      ctx.throw(500, e)
    }
  })(
    ctx,
    next
  )
})

export default router
