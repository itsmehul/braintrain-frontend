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
import { setGqlIds, setSnackState, setDialog } from '../../actions'
import {
	CREATE_CLASSROOM_MUTATION,
	EDIT_CLASSROOM_MUTATION
} from '../../gql/Mutations'
import CustomImageInput from '../CustomImageInput/CustomImageInput'
import axios from 'axios'
import { cloneDeep } from 'apollo-utilities';

const mapDispatchToProps = dispatch => {
	return {
		setGqlIds: id => dispatch(setGqlIds(id)),
		setSnackState: state => dispatch(setSnackState(state)),
		setDialog: state => dispatch(setDialog(state))
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
	dataToEdit,
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
					variant="filled"
					multiline
				/>
				<Field
					className="form_text_field"
					type="text"
					name="description"
					label="description"
					component={TextField}
					variant="filled"
					multiline
				/>
				<Field
					className="form_text_field"
					type="text"
					name="learning"
					label="learning"
					component={TextField}
					variant="filled"
					multiline
				/>
				<Field
					className="form_text_field"
					type="text"
					name="language"
					label="language"
					component={TextField}
					variant="filled"
					multiline
				/>
				<Field
					className="form_text_field"
					type="text"
					name="requirements"
					label="requirements"
					component={TextField}
					variant="filled"
					multiline
				/>
				<Field
					className="form_text_field"
					type="text"
					name="objectives"
					label="objectives"
					component={TextField}
					variant="filled"
					multiline
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
			file,
			dataToEdit
		}) {
			return {
				name: name || dataToEdit?dataToEdit.name:'',
				description: description || dataToEdit?dataToEdit.description:'',
				learning: learning || dataToEdit?dataToEdit.learning:'',
				language: language || dataToEdit?dataToEdit.language:'',
				requirements: requirements || dataToEdit?dataToEdit.requirements:'',
				objectives: objectives || dataToEdit?dataToEdit.objectives:'',
				file: file || undefined
			}
		},
		validationSchema: Yup.object().shape({
			name: Yup.string().max(200, `Don't exceed more than 50 characters`),
			description: Yup.string().max(
				2000,
				`Don't exceed more than 555 characters`
			),
			learning: Yup.string(),
			language: Yup.string(),
			requirements: Yup.string(),
			objectives: Yup.string()
		}),
		handleSubmit: async (
			values,
			{ resetForm, setErrors, setSubmitting, setStatus, props }
		) => {
			const { setGqlIds, setSnackState, edit } = props
			let classroomImage = ''
			if (typeof(file)!=='undefined'){
			try {
				let formData = new FormData()
				formData.append('file', values.file)
				formData.append('upload_preset', 'elny2udg')
				const cloudinaryData = await axios.post(
					`https://api.cloudinary.com/v1_1/mrgawde/upload`,
					formData
				)
				classroomImage = cloudinaryData.data.url
			} catch (error) {
				console.log(error)
			}}
			values = { classroomImage, ...values }
			const valuesToEdit = Object.entries(values)
				.filter(val => val[1] !== '' && typeof (val[1] !== 'undefined'))
				.reduce((accum, [k, v]) => {
					accum[k] = v
					return accum
				}, {})
			try {
				if (edit) {
					const response = await props.client.mutate({
						mutation: EDIT_CLASSROOM_MUTATION,
						variables: {
							...valuesToEdit,
							classroomImage,
							classroomId: props.classroomId
						}
					})
					resetForm()
					setSubmitting(false)
					setStatus({ success: true })
					setGqlIds({ classroomId: response.data.updateClassroom.id })
					setSnackState({
						message: 'Successfully edited this classroom!',
						variant: 'success',
						open: true
					})
					props.setDialog({open:false})

				} else {
					const response = await props.client.mutate({
						mutation: CREATE_CLASSROOM_MUTATION,
						variables: {
							...values,
							classroomImage
						}
					})
					resetForm()
					setSubmitting(false)
					setStatus({ success: true })
					props.setAllowNext(false)
					setGqlIds({ classroomId: response.data.createClassroom.id })
					setSnackState({
						message: 'Successfully created a classroom!',
						variant: 'success',
						open: true
					})
				}
			} catch (error) {
				setSnackState({
					message: error.message,
					variant: 'error',
					open: true
				})
			}

			setSubmitting(false)
		}
	})
)(CreateClassroomForm)
