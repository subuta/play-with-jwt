import jwt from 'jsonwebtoken'
import _ from 'lodash'

const SECRET = process.env.JWT_SECRET || 'secret'
const ISSUER = 'example.com'

const sign = (payload) => {
  // Default options.
  const options = {
    algorithm: 'HS256',
    expiresIn: '1 days',
    noTimestamp: false
  }

  if (!payload.iss) {
    options.issuer = ISSUER
  }
  return jwt.sign(payload, SECRET, options)
}

const verify = (token, options = {}) => {
  return jwt.verify(token, SECRET, options)
}

// SEE: https://github.com/auth0/node-jsonwebtoken#refreshing-jwts
// SEE: https://gist.github.com/ziluvatar/a3feb505c4c0ec37059054537b38fc48
const refresh = (token) => {
  // We are generating a new token, if you are using jwtid during signing, pass it in refreshOptions
  const payload = _.omit(verify(token, { issuer: ISSUER }), ['iat', 'exp', 'nbf', 'jti'])
  return sign(payload)
}

export {
  ISSUER,

  sign,
  verify,
  refresh
}

export default {
  ISSUER,

  sign,
  verify,
  refresh
}
