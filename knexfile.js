module.exports = (() => {
  let config = {
    migrations: {
      directory: './db/migrations'
    },
    seeds: {
      directory: './db/seeds/dev'
    }
  }

  config = {
    ...config,
    client: 'sqlite3',
    connection: {
      filename: './data/dev.sqlite'
    },
    useNullAsDefault: true
  }

  return config
})()
