import sinon from 'sinon'

import jwt from 'server/utils/jwt'

import { mountMiddleware } from './common'
import users from '../users'

let client = null
let clock = null

beforeEach(async () => {
  client = mountMiddleware(users.routes(), users.allowedMethods())
  clock = sinon.useFakeTimers()
})

afterEach(async () => {
  client.destroy()
  clock.restore()
})

test('me should return 401 without Authorization header', async () => {
  await client.get('/users/me').expect(401)
})

test('me should return 200 with Authorization header', async () => {
  const token = jwt.sign({
    userId: 1
  })

  const response = await client
    .get('/users/me')
    .set('Authorization', `bearer ${token}`)
    .expect(200)

  expect(response.body).toEqual({
    id: 1,
    email: 'hoge@piyo.com',
    name: 'John doe',
    avatar_url: jasmine.any(String),
    created_at: jasmine.any(String),
    updated_at: jasmine.any(String)
  })
})
