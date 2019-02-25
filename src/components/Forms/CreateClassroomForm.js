import React from 'react'
import PropTypes from 'prop-types'

import { withFormik, Form, Field } from 'formik'
import * as Yup from 'yup'
import Button from '@material-ui/core/Button'
import { TextField } from 'formik-material-ui'
import * as ROUTES from '../../constants/routes'
import { AUTH_TOKEN } from '../../constants/authToken'
import { withRouter } from 'react-router-dom'
import { withFirebase } from '../../components/Firebase'
import { withApollo } from 'react-apollo'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import { setGqlIds, setSnackState } from '../../actions'
import {
	CREATE_CLASSROOM_MUTATION,
	EDIT_CLASSROOM_MUTATION
} from '../../gql/Mutations'
import CustomImageInput from '../CustomImageInput/CustomImageInput'
import axios from 'axios'

const mapDispatchToProps = dispatch => {
	return {
		setGqlIds: id => dispatch(setGqlIds(id)),
		setSnackState: state => dispatch(setSnackState(state))
	}
}
const mapStateToProps = state => {
	return { gqlIds: state.myreducer.gqlIds }
}

const CreateClassroomForm = ({
	values,
	errors,
	touched,
	isSubmitting,
	submitForm,
	status,
	setFieldValue,
	handleBlur,
	edit
}) => {

	return (
		<React.Fragment>
			<Form>
				<Field
					className="form_text_field"
					type="text"
					name="name"
					label="Name"
					component={TextField}
					variant="outlined"
				/>
				<Field
					className="form_text_field"
					type="text"
					name="description"
					label="description"
					component={TextField}
					variant="outlined"
				/>
				<Field
					className="form_text_field"
					type="text"
					name="learning"
					label="learning"
					component={TextField}
					variant="outlined"
				/>
				<Field
					className="form_text_field"
					type="text"
					name="language"
					label="language"
					component={TextField}
					variant="outlined"
				/>
				<Field
					className="form_text_field"
					type="text"
					name="requirements"
					label="requirements"
					component={TextField}
					variant="outlined"
				/>
				<Field
					className="form_text_field"
					type="text"
					name="objectives"
					label="objectives"
					component={TextField}
					variant="outlined"
				/>
					<Field
						name="file"
						component={CustomImageInput}
						title="Select a file"
						setFieldValue={setFieldValue}
						errorMessage={errors['file'] ? errors['file'] : undefined}
						touched={touched['file']}
						onBlur={handleBlur}
					/>
				<Button
					color="primary"
					variant="contained"
					disabled={isSubmitting}
					onClick={() => {
						submitForm()
					}}>
					{edit ? 'EDIT CLASSROOM' : 'CREATE CLASSROOM'}
				</Button>
			</Form>
		</React.Fragment>
	)
}

CreateClassroomForm.propTypes = {}

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
			description,
			learning,
			language,
			requirements,
			objectives,
			file

		}) {
			return {
				name: name || '',
				description: description || '',
				learning: learning || '',
				language: language || '',
				requirements: requirements || '',
				objectives: objectives || '',
				file: file || undefined,

			}
		},
		validationSchema: Yup.object().shape({
			// name: Yup.string()
			// 	.name('name not valid')
			// 	.required('name is required'),
		}),
		handleSubmit: async (
			values,
			{ resetForm, setErrors, setSubmitting, setStatus, props }
		) =>{
			const { setGqlIds, setSnackState, edit } = props
			let formData = new FormData()
			formData.append('file', values.file)
			formData.append('upload_preset', 'elny2udg')
			const cloudinaryData = await axios.post(
				`https://api.cloudinary.com/v1_1/mrgawde/upload`,
				formData
			)
			const classroomImage = cloudinaryData.data.url

			const valuesToEdit = Object.entries(values).filter(val=>val[1]!=='').reduce((accum, [k, v]) => {
				accum[k] = v;
				return accum;
			  }, {});
			if (edit) {
				props.client
					.mutate({
						mutation: EDIT_CLASSROOM_MUTATION,
						variables: {
							...valuesToEdit,
							classroomImage,
							classroomId:props.classroomId
						}
					})
					.then(response => {
						resetForm()
						setSubmitting(false)
						setStatus({ success: true })
						setGqlIds({ classroomId: response.data.createClassroom.id })
						setSnackState({
							message: 'Successfully created a classroom!',
							variant: 'success',
							open: true
						})
					})
					.catch(error => {
						setErrors({ name: error.message })
					})
			} else {
				props.client
					.mutate({
						mutation: CREATE_CLASSROOM_MUTATION,
						variables: {
							...values
						}
					})
					.then(response => {
						resetForm()
						setSubmitting(false)
						setStatus({ success: true })
						setGqlIds({ classroomId: response.data.createClassroom.id })
						setSnackState({
							message: 'Successfully created a classroom!',
							variant: 'success',
							open: true
						})
					})
					.catch(error => {
						setErrors({ name: error.message })
					})
			}
			setSubmitting(false)
		}
	})
)(CreateClassroomForm)
