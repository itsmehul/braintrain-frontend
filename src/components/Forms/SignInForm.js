import React from 'react'
import PropTypes from 'prop-types'

import { withFormik, Form, Field } from 'formik'
import * as Yup from 'yup'

import {
	TextField,
} from 'formik-material-ui'
import AccountCircle from '@material-ui/icons/AccountCircle'
import InputAdornment from '@material-ui/core/InputAdornment'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import * as ROUTES from '../../constants/routes'
import { AUTH_TOKEN } from '../../constants/authToken'
import { withRouter } from 'react-router-dom'
import { withFirebase } from '../../components/Firebase'
import { withApollo } from 'react-apollo'
import { compose } from 'recompose'
import { connect } from "react-redux";
import { setUserData } from "../../actions";
import { ROLE } from '../../constants/roles';
import { LOGIN_MUTATION } from '../../gql/Mutations';

const mapDispatchToProps = dispatch => {
  return { setUserData: user => dispatch(setUserData(user)) };
};
const mapStateToProps = state => {
  return { user: state.myreducer.user,
    snackState: state.myreducer.snackState
  };
};

const _confirm = async ({ data }, props) => {
	const { token, user:{role} } = data.login
	_saveUserData(token, role)
}
const _saveUserData = (token,role) => {
	localStorage.setItem(AUTH_TOKEN, token)
	localStorage.setItem(ROLE, role)

}

const SignInForm = ({ values, errors, touched, isSubmitting, submitForm }) => {
	const [showPass, setShowPass] = React.useState(false)
	const handleClickShowPassword = () => {
		setShowPass(!showPass)
	}
	return (
		<Form>
			<Field
				className="form_text_field"
				type="email"
				name="email"
				label="Email"
				component={TextField}
				variant="outlined"
				InputProps={{
					endAdornment: (
						<InputAdornment position="end" style={{ marginRight: '11px' }}>
							{' '}
							<AccountCircle />{' '}
						</InputAdornment>
					)
				}}
			/>
			<Field
				className="form_text_field"
				type={showPass ? 'text' : 'password'}
				name="password"
				label="Password"
				component={TextField}
				variant="outlined"
				InputProps={{
					endAdornment: (
						<InputAdornment position="end">
							<IconButton
								aria-label="Toggle password visibility"
								onClick={handleClickShowPassword}>
								{showPass ? <Visibility /> : <VisibilityOff />}
							</IconButton>
						</InputAdornment>
					)
				}}
			/>
			<Button variant="contained" color="primary" disabled={isSubmitting} onClick={submitForm}>
				{isSubmitting ? 'ENTERING' : 'ENTER PORTAL'}
			</Button>
		</Form>
	)
}

SignInForm.propTypes = {}

export default compose(
	withRouter,
	withFirebase,
	withApollo,
	connect(mapStateToProps,mapDispatchToProps),
	withFormik({
		mapPropsToValues({ email, password }) {
			return {
				email: email || '',
				password: password || ''
			}
		},
		validationSchema: Yup.object().shape({
			email: Yup.string()
				.email('Email not valid')
				.required('Email is required'),
			password: Yup.string().required('Password is required')
		}),
		handleSubmit(values, { resetForm, setErrors, setSubmitting, props }) {
			setSubmitting(true)
			const { email, password } = values
			props.firebase
				.doSignInWithEmailAndPassword(email, password)
				.then(authUser => {
					setSubmitting(false)
					const { uid, email } = authUser.user
					props.client
						.mutate({
							mutation: LOGIN_MUTATION,
							variables: { fid: uid, email }
						})
						.then(response => {
							_confirm(response, props)
							resetForm()
							
								props.history.push(ROUTES.HOME)
						})
						.catch(error => {
							setErrors({ email: error.message })
						})
				})
				.catch(error => {
					switch (error.code) {
						case 'auth/wrong-password':
							setErrors({ password: error.message })
							break
						case 'auth/user-not-found':
							setErrors({ email: error.message })
							break
						default:
							setErrors({ email: error.message })
					}
				})
			setSubmitting(false)
		}
	})
)(SignInForm)
