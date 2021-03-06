import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import Navigation from '../../components/Navigation'
import LandingPage from '../Landing'
import SignUpPage from '../SignUp'
import SignInPage from '../SignIn'
import PasswordForgetPage from '../PasswordForget'
import HomePage from '../Home'
import AccountPage from '../Account'
import AdminPage from '../Admin'

import * as ROUTES from '../../constants/routes'
import { withAuthentication } from '../../components/Session'
import ClassroomPage from '../Classroom'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import Profile from '../ProfileDetails'
import ClassroomDetails from '../Classroom/ClassroomDetails'
import { connect } from 'react-redux'
import { ReduxSnackbar } from '../../components/Snackbar/ReduxSnackbar'
import StudyRoom from '../Room'
import gql from 'graphql-tag'
import {compose} from 'recompose'
import { setUserData } from '../../actions'
import {withApollo} from 'react-apollo'
import PaymentFailed from '../Payment';
import { USER_QUERY } from '../../gql/Queries';
const mapStateToProps = state => {
	return {
		snackState: state.myreducer.snackState,
		user: state.myreducer.user
	}
}

const mapDispatchToProps = dispatch => {
	return { setUserData: user => dispatch(setUserData(user)) }
}

class App extends React.Component {
	componentDidMount = async () => {
		const user = await this.props.client.query({
			query:USER_QUERY,
		})
		this.props.setUserData(user.data.myprofile)
	}
	render() {
		const { snackState } = this.props
		return (
			<Router>
				<div>
					<Navigation />
					{snackState.open === true && <ReduxSnackbar />}
					<div className="main_body">
						<Route
							render={({ location }) => (
								<TransitionGroup>
									<CSSTransition
										key={location.key}
										classNames="fade"
										timeout={300}>
										<Switch location={location}>
											<Route path={ROUTES.SIGN_UP} component={SignUpPage} />
											<Route exact path={ROUTES.SIGN_IN} component={SignInPage} />
											<Route
												path={ROUTES.PASSWORD_FORGET}
												component={PasswordForgetPage}
											/>
											{/* <Route path={ROUTES.HOME} component={HomePage} /> */}
											<Route path={ROUTES.ACCOUNT} component={AccountPage} />
											<Route path={ROUTES.ADMIN} component={AdminPage} />
											<Route
												exact
												path={ROUTES.CLASSROOMS}
												component={ClassroomPage}
											/>
											<Route
												path={ROUTES.CLASSROOMS + '/:id'}
												component={ClassroomDetails}
											/>
											<Route path={ROUTES.PROFILE} component={Profile} />
											<Route path={ROUTES.PAYMENT_FAILED} component={PaymentFailed} />
											<Route
												path={ROUTES.ROOM + '/:id'}
												component={StudyRoom}
											/>
										</Switch>
									</CSSTransition>
								</TransitionGroup>
							)}
						/>
					</div>
				</div>
			</Router>
		)
	}
}
export default compose(connect(mapStateToProps,mapDispatchToProps),withApollo,withAuthentication)(App)
