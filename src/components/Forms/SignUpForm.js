import React from 'react'
import PropTypes from 'prop-types'
import { withFormik, Form, Field } from 'formik'
import * as Yup from 'yup'
import { TextField,  } from 'formik-material-ui'
import InputAdornment from '@material-ui/core/InputAdornment'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import * as ROUTES from '../../constants/routes'
import gql from 'graphql-tag'
import { AUTH_TOKEN } from '../../constants/authToken'
import { withRouter } from 'react-router-dom'
import { withFirebase } from '../../components/Firebase'
import { withApollo } from 'react-apollo'
import { compose } from 'recompose'
import { BAD_WORDS_REGEX } from '../../constants/regexfilters'
import { connect } from 'react-redux'
import { setUserData } from '../../actions'
import { SIGNUP_MUTATION, EDIT_USER_MUTATION } from '../../gql/Mutations'
import CustomImageInput from '../CustomImageInput/CustomImageInput'
import axios from 'axios'

const mapDispatchToProps = dispatch => {
	return { setUserData: user => dispatch(setUserData(user)) }
}
const mapStateToProps = state => {
	return { user: state.myreducer.user, snackState: state.myreducer.snackState }
}

const _confirm = async ({ data }, props) => {
	const { token } = data.signup
	_saveUserData(token)
}
const _saveUserData = token => {
	localStorage.setItem(AUTH_TOKEN, token)
}

const SignUpForm = ({
	values,
	errors,
	touched,
	isSubmitting,
	submitForm,
	handleChange,
	handleBlur,
	setFieldValue,
	edit,
	...rest
}) => {
	const [showPass, setShowPass] = React.useState(false)
	const handleClickShowPassword = () => {
		setShowPass(!showPass)
	}
	console.log(rest)
	return (
		<Form>
			{!edit ? (
				<React.Fragment>
					<Field
						name="file"
						component={CustomImageInput}
						title="Profile picture"
						setFieldValue={setFieldValue}
						errorMessage={errors['file'] ? errors['file'] : undefined}
						touched={touched['file']}
						onBlur={handleBlur}
					/>
					<Field
						className="form_text_field"
						type="name"
						name="name"
						label="name"
						component={TextField}
						variant="outlined"
					/>
					<Field
						className="form_text_field"
						type="email"
						name="email"
						label="Email"
						component={TextField}
						variant="outlined"
					/>
					<Field
						className="form_text_field"
						type={showPass ? 'text' : 'password'}
						name="password"
						label="Password"
						variant="outlined"
						component={TextField}
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
					<Field
						className="form_text_field"
						type={showPass ? 'text' : 'password'}
						name="passwordConfirm"
						label="Confirm password"
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
				</React.Fragment>
			) : (
				<React.Fragment>
					<Field
						className="form_text_field"
						name="file"
						component={CustomImageInput}
						title="Profile picture"
						setFieldValue={setFieldValue}
						errorMessage={errors['file'] ? errors['file'] : undefined}
						touched={touched['file']}
						onBlur={handleBlur}
					/>
					<Field
						className="form_text_field"
						type="name"
						name="name"
						label="name"
						component={TextField}
						variant="outlined"
					/>
					<Field
						className="form_text_field"
						type="text"
						name="description"
						label="Description"
						component={TextField}
						variant="outlined"
					/>
					<Field
						className="form_text_field"
						type="text"
						name="profession"
						label="Profession"
						component={TextField}
						variant="outlined"
					/>
				</React.Fragment>
			)}
			<Button
				variant="contained"
				color="primary"
				disabled={isSubmitting}
				onClick={submitForm}>
				{edit ? 'EDIT PROFILE' : 'CREATE PROFILE'}
			</Button>
		</Form>
	)
}

SignUpForm.propTypes = {}

export default compose(
	withRouter,
	withFirebase,
	withApollo,
	connect(
		mapStateToProps,
		mapDispatchToProps
	),
	withFormik({
		mapPropsToValues({
			name,
			email,
			password,
			passwordConfirm,
			description,
			profession,
			file
		}) {
			return {
				name: name || '',
				email: email || '',
				password: password || '',
				passwordConfirm: passwordConfirm || '',
				file: file || undefined,
				description: description || '',
				profession: profession || ''
			}
		},
		validationSchema: Yup.object().shape({
			name: Yup.string(),
			// .matches(BAD_WORDS_REGEX, {message: `Don't use vulgar language`, excludeEmptyString: true }),
			email: Yup.string().email('Email not valid'),
			password: Yup.string().min(6, 'Password too short'),
			passwordConfirm: Yup.string().test(
				'match',
				`passwords don't match`,
				function(passwordConfirm) {
					return passwordConfirm === this.parent.password
				}
			),
			// dpUrl: Yup.string(),
			description: Yup.string(),
			profession: Yup.string()
		}),
		handleSubmit: async (
			values,
			{ resetForm, setErrors, setSubmitting, setStatus, props }
		) => {
			const { email, password } = values
			let dpUrl=''
			try{
			let formData = new FormData()
			formData.append('file', values.file)
			formData.append('upload_preset', 'elny2udg')
			const cloudinaryData = await axios.post(
				`https://api.cloudinary.com/v1_1/mrgawde/upload`,
				formData
			)
			dpUrl = cloudinaryData.data.url}catch(error){
				console.log(error)
			}
			values = {dpUrl,...values}
			const valuesToEdit = Object.entries(values)
				.filter(val => val[1] !== '' && typeof (val[1] !== 'undefined'))
				.reduce((accum, [k, v]) => {
					accum[k] = v
					return accum
				}, {})
			if (props.edit) {
				try {
					await props.client.mutate({
						mutation: EDIT_USER_MUTATION,
						variables: { ...valuesToEdit }
					})
					resetForm()
					setSubmitting(false)
					const user = await props.client.query({
						query: gql`
							{
								myprofile {
									name
									role
								}
							}
						`
					})
					await props.setUserData({ user: { ...user.data.myprofile } })
				} catch (error) {}
			} else {
				try {
					const authUser = await props.firebase.doCreateUserWithEmailAndPassword(
						values.email,
						password
					)
					const { uid, email } = authUser.user
					const name = values.name

					const response = await props.client.mutate({
						mutation: SIGNUP_MUTATION,
						variables: { name, fid: uid, email, ...valuesToEdit }
					})
					_confirm(response, props)
					resetForm()
					setSubmitting(false)
					const user = await props.client.query({
						query: gql`
							{
								myprofile {
									name
									role
								}
							}
						`
					})
					await props.setUserData(user.data.myprofile)
					props.history.push(ROUTES.HOME)
				} catch (error) {
					switch (error.code) {
						case 'auth/email-already-in-use':
							setErrors({ email: error.message })
							break
						default:
							setErrors({ email: error.message })
					}
				}
			}

			setSubmitting(false)
		}
	})
)(SignUpForm)
