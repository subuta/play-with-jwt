import Router from 'koa-router'

import auth from './auth'
import hb from './hb'
import users from './users'

const router = new Router({
  prefix: '/api'
})

router.use(auth.routes(), auth.allowedMethods())
router.use(hb.routes(), hb.allowedMethods())
router.use(users.routes(), users.allowedMethods())

export default router
