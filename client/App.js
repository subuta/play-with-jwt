import React from 'react'

import _ from 'lodash'

import {
  compose,
  withStateHandlers,
  withHandlers,
  branch,
  mapProps,
  renderComponent,
  lifecycle
} from 'recompose'

import Login from './Login'

const JWT_KEY = 'com.example.play-with-jwt'

// Do simple styling with [Tailwind](https://tailwindcss.com/)
const buttonClass = 'py-2 px-4 bg-blue text-white font-bold rounded'

// SEE: https://github.com/acdlite/recompose/issues/75
const keyed = (propsToKey, BaseComponent) =>
  mapProps(
    props => ({
      ...props,
      key: propsToKey(props)
    }),
    BaseComponent
  )

const withLogin = branch(
  ({ jwt }) => !jwt,
  renderComponent(({ setJwt }) => {
    return (
      <Login onAuthorized={setJwt} />
    )
  }),
  _.identity
)

const enhance = compose(
  withStateHandlers(
    () => {
      const jwt = window.localStorage.getItem(JWT_KEY) || null
      return { jwt, profile: null }
    },
    {
      setJwt: () => (jwt) => {
        return { jwt, profile: null }
      },

      setProfile: () => (profile) => {
        return { profile }
      }
    }
  ),
  // Update key based on jwt for trigger re-mount at jwt changes.
  keyed((props) => {
    return props.jwt
  }),
  withHandlers({
    doLogout: ({ setJwt }) => () => {
      window.localStorage.removeItem(JWT_KEY)
      setJwt(null)
    }
  }),
  lifecycle({
    async componentDidMount () {
      const { jwt, setProfile } = this.props

      if (!jwt) return

      const response = await fetch('/api/users/me', {
        mode: 'cors',
        headers: {
          Authorization: `bearer ${jwt}`
        }
      }).catch((err) => console.error(err))

      const profile = await response.json()

      setProfile(profile)
    }
  }),
  withLogin
)

const Content = enhance(({ doLogout, profile }) => {
  return (
    <div className='p-8 bg-grey flex flex-col items-center justify-center border border-grey rounded'>
      {profile && (
        <div className='flex flex-col items-center justify-center'>
          <img
            className='w-24 h-24 rounded-full'
            src={profile.avatar_url}
            alt={`${profile.name}'s avatar`}
          />

          <p className='p-4 italic font-bold text-lg'>ようこそ {profile.name}さん !</p>
        </div>
      )}

      <button
        className={`mt-4 ${buttonClass}`}
        onClick={doLogout}
      >
        ログアウト
      </button>
    </div>
  )
})

export default () => {
  return (
    <div className='h-screen w-screen p-4 bg-grey-dark flex items-center justify-center'>
      <Content />
    </div>
  )
}
