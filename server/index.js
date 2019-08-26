import Koa from 'koa'
import consola from 'consola'

import cors from '@koa/cors'
import koaBody from 'koa-body'
import logger from 'koa-logger'

import passport from 'server/utils/passport'

import api from './api'

const app = new Koa()

const port = parseInt(process.env.PORT, 10) || 3001

app.use(koaBody({ multipart: true }))

// Enable cors
app.use(cors())

app.use(passport.initialize())

// Log requests
app.use(logger())

app.use(api.routes(), api.allowedMethods())

app.listen(port, () => {
  consola.info(`🚀 Server ready at http://localhost:${port}`)
})
