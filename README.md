# play-with-jwt
JWT + Node.js tutorial

This repository includes these examples

- [x] User local(email/password) authentication by [Passport](http://www.passportjs.org)
- [x] Protected API example with [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) and [koa-jwt](https://github.com/koajs/jwt)
- [x] DB Query example with [knex.js](https://knexjs.org)
- [x] Simple client app with [React](https://github.com/facebook/react)

## How to develop

### Start server

```bash
# Starts both (client and server)
npm start

# Initialize database
npm run migrate:reset

# Run tests(with Jest)
npm test
```

### Database related actions

```bash
# Generate seed
npx knex seed:make seed_name

# Generate migration
npx knex migrate:make migration_name

# List all users
sqlite3 ./data/dev.sqlite 'select * from users;'
```
