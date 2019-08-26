import sinon from 'sinon'

import { mountMiddleware } from './common'
import auth from '../auth'

let client = null
let clock = null

beforeEach(async () => {
  client = mountMiddleware(auth.routes(), auth.allowedMethods())
  clock = sinon.useFakeTimers()
})

afterEach(async () => {
  client.destroy()
  clock.restore()
})

test('/api/auth/login should return jwt for valid credentials', async () => {
  const response = await client
    .post('/auth/login')
    .send({
      email: 'hoge@piyo.com',
      password: 'password'
    })
    .expect(200)
  expect(response.body.jwt).toEqual(jasmine.any(String))
})

test('/api/auth/login should not return jwt for invalid credentials', async () => {
  await client
    .post('/auth/login')
    .send({
      email: 'hoge@piyo.com',
      password: 'invalid'
    })
    .expect(401)
})
