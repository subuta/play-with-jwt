const bcrypt = require('bcrypt')
const _ = require('lodash')

const getAvatarUrl = () => `https://randomuser.me/api/portraits/${_.sample(['men', 'women'])}/${_.random(50)}.jpg`

// SEE: https://github.com/kelektiv/node.bcrypt.js#readme
const saltRounds = 1

exports.seed = async (knex) => {
  // Deletes ALL existing entries
  await knex('users').del()

  const hashedPassword = await bcrypt.hash('password', saltRounds)

  return knex('users').insert([
    {
      email: 'hoge@piyo.com',
      password: hashedPassword,
      name: 'John doe',
      avatar_url: getAvatarUrl()
    }
  ])
}
