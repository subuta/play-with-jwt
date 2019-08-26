import passport from 'koa-passport'
import { Strategy as LocalStrategy } from 'passport-local'

import bcrypt from 'bcrypt'

import db from './knex'

// Serialize to ID
passport.serializeUser(function (user, done) {
  done(null, user.id)
})

// Find by ID
passport.deserializeUser(async function (id, done) {
  try {
    const user = await db.from('users').select('*').where({ id }).first()
    done(null, user)
  } catch (err) {
    done(err)
  }
})

// Email & Password auth.
const localStrategyOptions = {
  usernameField: 'email',
  passwordField: 'password'
}

passport.use(
  new LocalStrategy(localStrategyOptions, async (email, password, done) => {
    const user = await db.from('users').select('*').where({ email }).first()
    // User for email not found.
    if (!user) return done(null, false)
    // Compare hashed password.
    const isAuthenticated = await bcrypt.compare(password, user.password)
    return done(null, isAuthenticated ? user : null)
  })
)

export default passport
