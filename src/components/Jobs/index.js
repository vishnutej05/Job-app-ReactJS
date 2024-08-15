/* eslint-disable no-use-before-define */
/* eslint-disable no-shadow */
/* eslint-disable jsx-a11y/control-has-associated-label */
import {useState, useEffect} from 'react'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import ProfileDetails from '../ProfileDetails'
import FiltersGroup from '../FiltersGroup'
import JobCard from '../JobCard'

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

const Jobs = () => {
  const [profileDetails, setProfileDetails] = useState({})
  const [profileApiStatus, setProfileApiStatus] = useState(
    apiStatusConstants.initial,
  )
  const [jobsList, setJobsList] = useState([])
  const [jobsApiStatus, setJobsApiStatus] = useState(apiStatusConstants.initial)
  const [searchInput, setSearchInput] = useState('')
  const [activeSalaryRangeId, setActiveSalaryRangeId] = useState('')
  const [employmentTypesChecked, setEmploymentTypesChecked] = useState([])

  useEffect(() => {
    getProfileDetails()
    getJobs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const updateEmploymentTypesChecked = typeId => {
    let updatedList = employmentTypesChecked
    if (employmentTypesChecked.includes(typeId)) {
      updatedList = employmentTypesChecked.filter(
        eachType => eachType !== typeId,
      )
    } else {
      updatedList = [...updatedList, typeId]
    }

    setEmploymentTypesChecked(updatedList)
    getJobs()
  }

  const updateSalaryRangeId = activeSalaryRangeId => {
    setActiveSalaryRangeId(activeSalaryRangeId)
    getJobs()
  }

  const getJobs = async () => {
    setJobsApiStatus(apiStatusConstants.inProgress)

    const employTypes = employmentTypesChecked.join(',')
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${employTypes}&minimum_package=${activeSalaryRangeId}&search=${searchInput}`

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      const {jobs} = data
      const updatedData = jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      setJobsList(updatedData)
      setJobsApiStatus(apiStatusConstants.success)
    } else {
      setJobsApiStatus(apiStatusConstants.failure)
    }
  }

  const getProfileDetails = async () => {
    setProfileApiStatus(apiStatusConstants.inProgress)

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()
    if (response.ok === true) {
      const profileDetails = data.profile_details
      const updatedData = {
        name: profileDetails.name,
        profileImageUrl: profileDetails.profile_image_url,
        shortBio: profileDetails.short_bio,
      }
      setProfileDetails(updatedData)
      setProfileApiStatus(apiStatusConstants.success)
    } else {
      setProfileApiStatus(apiStatusConstants.failure)
    }
  }

  const renderSearchBar = searchBarID => (
    <div className="search-bar" id={searchBarID}>
      <input
        className="search-input"
        type="search"
        placeholder="Search"
        value={searchInput}
        onChange={e => setSearchInput(e.target.value)}
      />
      <button
        className="search-button"
        type="button"
        data-testid="searchButton"
        onClick={getJobs}
      >
        <BsSearch className="search-icon" />
      </button>
    </div>
  )

  const renderSideBar = () => (
    <div className="side-bar">
      {renderSearchBar('smallSearchBar')}
      <ProfileDetails
        profileDetails={profileDetails}
        profileApiStatus={profileApiStatus}
        getProfileDetails={getProfileDetails}
      />
      <hr className="separator" />
      <FiltersGroup
        updateSalaryRangeId={updateSalaryRangeId}
        activeSalaryRangeId={activeSalaryRangeId}
        updateEmploymentTypesChecked={updateEmploymentTypesChecked}
        employmentTypesChecked={employmentTypesChecked}
      />
    </div>
  )

  const renderNoJobsView = () => (
    <div className="no-jobs-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="no-jobs-image"
      />
      <h1 className="no-jobs-heading">No Jobs Found</h1>
      <p className="no-jobs-description">
        We could not find any jobs. Try other filters.
      </p>
    </div>
  )

  const renderJobsList = () => (
    <>
      {jobsList.length > 0 ? (
        <ul className="jobs-list">
          {jobsList.map(eachJob => (
            <JobCard key={eachJob.id} jobDetails={eachJob} />
          ))}
        </ul>
      ) : (
        renderNoJobsView()
      )}
    </>
  )

  const renderJobsLoaderView = () => (
    <div className="jobs-loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  const renderJobsApiFailureView = () => (
    <div className="jobs-api-failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="job-api-failure-image"
      />
      <h1 className="failure-view-heading">Oops! Something Went Wrong</h1>
      <p className="failure-view-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button type="button" className="retry-button" onClick={getJobs}>
        Retry
      </button>
    </div>
  )

  const renderJobsBasedOnAPiStatus = () => {
    switch (jobsApiStatus) {
      case apiStatusConstants.inProgress:
        return renderJobsLoaderView()
      case apiStatusConstants.success:
        return renderJobsList()
      case apiStatusConstants.failure:
        return renderJobsApiFailureView()
      default:
        return null
    }
  }

  return (
    <div className="jobs-page-container">
      <Header />
      <div className="jobs-page">
        {renderSideBar()}
        <div className="jobs-container">
          {renderSearchBar('largeSearchBar')}
          {renderJobsBasedOnAPiStatus()}
        </div>
      </div>
    </div>
  )
}

export default Jobs
