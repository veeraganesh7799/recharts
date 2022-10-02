import {Component} from 'react'
import Loader from 'react-loader-spinner'
import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class CowinDashboard extends Component {
  state = {
    last7DaysVaccination: [],
    vaccinationByAge: [],
    vaccinationByGender: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getCovidVaccinationData()
  }

  getCovidVaccinationData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const url = 'https://apis.ccbp.in/covid-vaccination-data'
    const response = await fetch(url)
    console.log(response)
    if (response.ok) {
      const data = await response.json()
      const last7DaysVaccinationUpdatedData = data.last_7_days_vaccination.map(
        each => ({
          dose1: each.dose_1,
          dose2: each.dose_2,
          vaccineDate: each.vaccine_date,
        }),
      )
      const vaccinationByAgeUpdatedData = data.vaccination_by_age.map(each => ({
        age: each.age,
        count: each.count,
      }))
      const vaccinationByGenderUpdatedData = data.vaccination_by_gender.map(
        each => ({
          count: each.count,
          gender: each.gender,
        }),
      )
      this.setState({
        last7DaysVaccination: last7DaysVaccinationUpdatedData,
        vaccinationByAge: vaccinationByAgeUpdatedData,
        vaccinationByGender: vaccinationByGenderUpdatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        className="failure-view"
        alt="failure view"
      />
      <h1 className="failure-view-heading">Something went wrong</h1>
    </div>
  )

  renderLoader = () => (
    <div className="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderCovidVaccinationDetails = () => {
    const {
      last7DaysVaccination,
      vaccinationByGender,
      vaccinationByAge,
    } = this.state
    return (
      <>
        <div className="vaccination-coverage-container">
          <h1 className="vaccination-coverage-heading">Vaccination Coverage</h1>
          <VaccinationCoverage last7DaysVaccination={last7DaysVaccination} />
        </div>
        <div className="vaccination-gender-container">
          <h1 className="vaccination-gender-heading">Vaccination by gender</h1>
          <VaccinationByGender vaccinationByGender={vaccinationByGender} />
        </div>
        <div className="vaccination-age-container">
          <h1 className="vaccination-age-heading">Vaccination by age</h1>
          <VaccinationByAge vaccinationByAge={vaccinationByAge} />
        </div>
      </>
    )
  }

  renderFinalUI = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderCovidVaccinationDetails()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="app-container">
        <div className="responsive-container">
          <div className="website-logo-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
              className="website-logo"
              alt="website logo"
            />
            <p className="caption">Co-WIN</p>
          </div>
          <h1 className="heading">CoWIN Vaccination In India</h1>
          {this.renderFinalUI()}
        </div>
      </div>
    )
  }
}
export default CowinDashboard
