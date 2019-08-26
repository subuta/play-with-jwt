import Koa from 'koa'
import compose from 'koa-compose'
import koaBody from 'koa-body'
import passport from 'server/utils/passport'
import request from 'supertest'

const mountMiddleware = (...middlewares) => {
  const app = new Koa()

  app.use(compose([
    koaBody({ multipart: true }),
    passport.initialize(),
    ...middlewares
  ]))

  const server = app.listen(0)

  const client = request(server)

  client.server = server
  client.destroy = () => {
    server.close()
  }

  return client
}

export {
  mountMiddleware
}

export default {
  mountMiddleware
}
