import React from 'react'
import PropTypes from 'prop-types'

import { withFormik, Form, Field } from 'formik'
import * as Yup from 'yup'
import Button from '@material-ui/core/Button'
import { TextField } from 'formik-material-ui'
import { withRouter } from 'react-router-dom'
import { withFirebase } from '../Firebase'
import { withApollo } from 'react-apollo'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import { setGqlIds, setSnackState } from '../../actions'
import { CREATE_BATCH_MUTATION, EDIT_BATCH_MUTATION } from '../../gql/Mutations'
const mapDispatchToProps = dispatch => {
	return {
		setGqlIds: id => dispatch(setGqlIds(id)),
		setSnackState: state => dispatch(setSnackState(state))
	}
}
const mapStateToProps = state => {
	return { gqlIds: state.myreducer.gqlIds }
}
const CreateBatchForm = ({
	values,
	errors,
	touched,
	isSubmitting,
	submitForm,
	status,
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
					type="datetime-local"
					name="startsFrom"
					component={TextField}
					variant="outlined"
				/>
				<Field
					className="form_text_field"
					type="number"
					name="fee"
					label="fee"
					component={TextField}
					variant="outlined"
				/>

				<Button
					color="primary"
					variant="contained"
					disabled={isSubmitting}
					onClick={() => {
						submitForm()
					}}>
					{edit ? 'EDIT BATCH' : 'CREATE BATCH'}
				</Button>
			</Form>
		</React.Fragment>
	)
}

CreateBatchForm.propTypes = {}

export default compose(
	withRouter,
	withFirebase,
	withApollo,
	connect(
		mapStateToProps,
		mapDispatchToProps
	),
	withFormik({
		mapPropsToValues({ name, description, startsFrom, fee }) {
			return {
				name: name || '',
				description: description || '',
				startsFrom: startsFrom || '',
				fee: fee || ''
			}
		},
		validationSchema: Yup.object().shape({
			name: Yup.string().max(24,`Don't exceed more than 24 characters`),
			description: Yup.string().max(150,`Don't exceed more than 150 characters`),
			startsFrom: Yup.date().min(new Date()),
			fee: Yup.string(),
		}),
		handleSubmit(
			values,
			{ resetForm, setErrors, setSubmitting, setStatus, props }
		) {
			const { setGqlIds, gqlIds, edit, batchId } = props
			const classroomId = props.classroomId?props.classroomId:gqlIds.classroomId
			const valuesToEdit = Object.entries(values)
				.filter(val => val[1] !== '')
				.reduce((accum, [k, v]) => {
					accum[k] = v
					return accum
				}, {})
			console.log(values)

			if (edit) {
				props.client
					.mutate({
						mutation: EDIT_BATCH_MUTATION,
						variables: {
							...valuesToEdit,
							batchId
						}
					})
					.then(response => {
						resetForm()
						setSubmitting(false)
						setStatus({ success: true })
						setGqlIds({ batchId: response.data.createBatch.id })
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
						mutation: CREATE_BATCH_MUTATION,
						variables: {
							...values,
							classroomId
						}
					})
					.then(response => {
						resetForm()
						setSubmitting(false)
						setStatus({ success: true })
						setGqlIds({ batchId: response.data.createBatch.id })
						setSnackState({
							message: 'Successfully created a batch!',
							variant: 'success',
							open: true
						})
					})
					.catch(error => {
						setSnackState({
							message: `${error}`,
							variant: 'error',
							open: true
						})
					})
			}

			setSubmitting(false)
		}
	})
)(CreateBatchForm)
