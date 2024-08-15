/* eslint-disable no-shadow */
import {useState} from 'react'
import Cookies from 'js-cookie'
import {Redirect, useHistory} from 'react-router-dom'

import './index.css'

const Login = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [showErrorMsg, setShowErrorMsg] = useState(false)
  const history = useHistory()

  const onSuccessLogin = jwtToken => {
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  const onFailureLogin = errorMsg => {
    setErrorMsg(errorMsg)
    setShowErrorMsg(true)
  }

  const onSubmitForm = async event => {
    event.preventDefault()
    let modifiedUsername = username
    let modifiedPassword = password

    if (username.toLowerCase().trim() === 'vishnu') modifiedUsername = 'rahul'
    if (password === 'vishnu@2024') modifiedPassword = 'rahul@2021'

    const userDetails = {username: modifiedUsername, password: modifiedPassword}
    const LoginApiUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(LoginApiUrl, options)
    const data = await response.json()

    if (response.ok) {
      onSuccessLogin(data.jwt_token)
    } else {
      onFailureLogin(data.error_msg)
    }
  }

  const renderUsernameField = () => (
    <div className="input-field-container">
      <label htmlFor="username" className="login-input-label">
        USERNAME
      </label>
      <input
        type="text"
        value={username}
        className="login-input-field"
        placeholder="vishnu"
        id="username"
        onChange={e => setUsername(e.target.value)}
      />
    </div>
  )

  const renderPasswordField = () => (
    <div className="input-field-container">
      <label htmlFor="password" className="login-input-label">
        PASSWORD
      </label>
      <input
        type="password"
        value={password}
        className="login-input-field"
        placeholder="vishnu@2024"
        id="password"
        onChange={e => setPassword(e.target.value)}
      />
    </div>
  )

  const jwtToken = Cookies.get('jwt_token')
  if (jwtToken !== undefined) {
    return <Redirect to="/" />
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={onSubmitForm}>
        <img
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
          className="website-logo-login-form"
        />
        {renderUsernameField()}
        {renderPasswordField()}
        <div>
          <button type="submit" className="login-button">
            Login
          </button>
          {showErrorMsg && <p className="error-msg">*{errorMsg}</p>}
        </div>
      </form>
    </div>
  )
}

export default Login
