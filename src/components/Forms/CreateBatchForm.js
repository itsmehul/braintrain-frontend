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
import { setGqlIds, setSnackState, setDialog } from '../../actions'
import { CREATE_BATCH_MUTATION, EDIT_BATCH_MUTATION } from '../../gql/Mutations'
import { CLASSROOM_QUERY_LOGGEDIN } from '../../gql/Queries'
import gql from 'graphql-tag'
import { convertDateToISO } from '../../utils/time';

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
					type="datetime-local"
					name="startsFrom"
					label="start date"
					component={TextField}
					variant="filled"
				/>
				<Field
					className="form_text_field"
					type="number"
					name="fee"
					label="fee"
					component={TextField}
					variant="filled"
					multiline
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
		mapPropsToValues({ name, description, startsFrom, fee, dataToEdit }) {
			return {
				name: name || dataToEdit ? dataToEdit.name : '',
				description: description || dataToEdit ? dataToEdit.description : '',
				startsFrom: startsFrom || dataToEdit ? dataToEdit.startsFrom.substring(0,16) : '',
				fee: fee || dataToEdit ? dataToEdit.fee : ''
			}
		},
		validationSchema: Yup.object().shape({
			name: Yup.string().max(24, `Don't exceed more than 24 characters`),
			description: Yup.string().max(
				150,
				`Don't exceed more than 150 characters`
			),
			startsFrom: Yup.date().min(new Date()),
			fee: Yup.number().typeError('Please enter valid number')
		}),
		handleSubmit: async (
			values,
			{ resetForm, setErrors, setSubmitting, setStatus, props }
		) => {
			const { setGqlIds, gqlIds, edit, batchId, setSnackState } = props
			const classroomId = props.classroomId
				? props.classroomId
				: gqlIds.classroomId
			
			let { startsFrom } = values
			startsFrom = convertDateToISO(startsFrom)
			values = {...values, startsFrom}
			const valuesToEdit = Object.entries(values)
				.filter(val => val[1] !== '')
				.reduce((accum, [k, v]) => {
					accum[k] = v
					return accum
				}, {})
			try {
				if (edit) {
					const response = await props.client.mutate({
						mutation: EDIT_BATCH_MUTATION,
						variables: {
							...valuesToEdit,
							fee: parseFloat(values.fee),
							batchId
						},
						refetchQueries: [{
							query: CLASSROOM_QUERY_LOGGEDIN,
							variables: { id: classroomId},
						  }],
					})
					resetForm()
					setGqlIds({ batchId: response.data.updateBatch.id })
					setSnackState({
						message: 'Successfully edited this batch!',
						variant: 'success',
						open: true
					})
					props.setDialog({open:false})

				} else {
					const response = await props.client.mutate({
						mutation: CREATE_BATCH_MUTATION,
						variables: {
							...values,
							fee: parseFloat(values.fee),
							classroomId
						},
						refetchQueries: [{
							query: CLASSROOM_QUERY_LOGGEDIN,
							variables: { id: props.classroomId},
						  }],
					})
					resetForm()
					setGqlIds({ batchId: response.data.createBatch.id })
					setSnackState({
						message: 'Successfully created a batch!',
						variant: 'success',
						open: true
					})
					if(props.setAllowNext)props.setAllowNext(false)
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
)(CreateBatchForm)
