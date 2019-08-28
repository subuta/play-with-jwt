import React from 'react'

import _ from 'lodash'

import { Form } from 'react-powerplug'
import { compose, withHandlers, withState } from 'recompose'

const JWT_KEY = 'com.example.play-with-jwt'

// Do simple styling with [Tailwind](https://tailwindcss.com/)
const buttonClass = 'py-2 px-4 bg-blue text-white font-bold rounded'
const inputClass = 'mb-4 p-2 rounded'
const labelClass = 'mr-2 w-32 font-bold text-sm text-right'
const inputFieldClass = 'flex items-baseline justify-start'

const enhance = compose(
  withState('error', 'setError', null),
  withHandlers({
    doLogin: ({ onAuthorized = _.noop, setError }) => async (fields) => {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(fields)
      }).catch((err) => {
        console.error(err)
        setError(err)
      })
      const json = await response.json()
      const jwt = json.jwt || null
      if (!jwt) return
      window.localStorage.setItem(JWT_KEY, jwt)
      onAuthorized(jwt)
    }
  })
)

export default enhance(({ doLogin, error, setError }) => (
  <Form
    initial={{ email: 'hoge@piyo.com', password: 'password' }}
    onChange={(values) => setError(null)}
  >
    {(formProps) => {
      return (
        <form
          className='p-8 bg-grey flex flex-col items-center justify-center border border-grey rounded'
          onSubmit={(e) => {
            e.preventDefault()
            doLogin(formProps.values)
          }}
        >
          <label className={inputFieldClass}>
            <span className={labelClass}>メールアドレス</span>
            <input
              className={inputClass}
              type='email'
              placeholder='xxx@example.com'
              {...formProps.field('email').bind}
            />
          </label>

          <label className={inputFieldClass}>
            <span className={labelClass}>パスワード</span>

            <input
              className={inputClass}
              type='password'
              placeholder='password'
              {...formProps.field('password').bind}
            />
          </label>

          <div className={`w-full mt-4 ${inputFieldClass}`}>
            <span className='mr-2 w-32'>&nbsp;</span>
            <button className={buttonClass}>ログイン</button>
          </div>

          {error && (
            <p className='mt-6 font-bold text-red'>{error.message}</p>
          )}
        </form>
      )
    }}
  </Form>
))
