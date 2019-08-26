import sinon from 'sinon'
import jwt from 'jsonwebtoken'
import ms from 'ms'

import jwtUtils from '../jwt'

let clock

beforeEach(() => {
  clock = sinon.useFakeTimers()
})

afterEach(() => {
  clock.restore()
})

const claim = {
  userId: 1
}

test('jwt sign/decode and refresh token', () => {
  const token = jwtUtils.sign(claim)

  clock.tick(ms('1 days') - 1)

  const token2 = jwtUtils.sign(claim)

  expect(jwt.decode(token, { complete: true }).header).toEqual({ alg: 'HS256', typ: 'JWT' })
  expect(jwt.decode(token, { complete: true }).payload).toEqual({ userId: 1, iat: 0, exp: 86400, iss: 'example.com' })

  expect(jwt.decode(token2, { complete: true }).header).toEqual({ alg: 'HS256', typ: 'JWT' })
  expect(jwt.decode(token2, { complete: true }).payload).toEqual({ userId: 1, iat: 86399, exp: 172799, iss: 'example.com' })

  clock.tick(1)

  // Should not refresh expired jwt.
  expect(() => {
    jwtUtils.refresh(token)
  }).toThrowError('jwt expired')

  const token3 = jwtUtils.refresh(token2)

  expect(jwt.decode(token3, { complete: true }).header).toEqual({ alg: 'HS256', typ: 'JWT' })
  expect(jwt.decode(token3, { complete: true }).payload).toEqual({ userId: 1, iss: 'example.com', iat: 86400, exp: 172800 })
})

test('jwt verify should throw error for invalid secret passed', () => {
  // JWT signed with invalid secret.
  const token = jwt.sign(claim, 'dummy')

  // Should throw error
  expect(() => {
    jwtUtils.verify(token)
  }).toThrowError('invalid signature')

  // Should decode token even if token is invalid.
  expect(jwt.decode(token, { complete: true }).header).toEqual({ alg: 'HS256', typ: 'JWT' })
  expect(jwt.decode(token, { complete: true }).payload).toEqual({ userId: 1, iat: 0 })
})
