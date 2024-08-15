/* eslint-disable react/button-has-type */
import {useHistory} from 'react-router-dom'
import './index.css'

const NotFound = () => {
  const navigate = useHistory()
  const redirect = () => {
    navigate.push('/login')
  }
  return (
    <div className="not-found-page">
      <div className="not-found-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/jobby-app-not-found-img.png"
          alt="not found"
          className="not-found-image"
        />
        <h1 className="not-found-heading">Page Not Found</h1>
        <p className="not-found-description">
          We are sorry, the page you requested could not be found
        </p>
        <button className="take-me-back" onClick={redirect}>
          Take me back
        </button>
      </div>
    </div>
  )
}

export default NotFound
