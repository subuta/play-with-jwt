import sinon from 'sinon'

import knex from 'server/utils/knex'

import { mountMiddleware } from './common'
import hb from '../hb'

let client = null
let clock = null

beforeEach(async () => {
  client = mountMiddleware(hb.routes(), hb.allowedMethods())
  clock = sinon.useFakeTimers()
})

afterEach(async () => {
  client.destroy()
  clock.restore()
})

test('hb should return response', async () => {
  const response = await client.get('/hb').expect(200)
  expect(response.text).toEqual('💓')
})

test('hb should throw error on db connection issue', async () => {
  // Suppress error log.
  jest.spyOn(global.console, 'error').mockImplementation(() => jest.fn())

  const spy = jest.spyOn(knex, 'raw').mockImplementation(() => {
    throw new Error('Connection error')
  })

  await client.get('/hb').expect(500)

  expect(spy).toHaveBeenCalledWith('select 1 as result')

  spy.mockRestore()
  global.console.error.mockRestore()
})
