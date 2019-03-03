import React from 'react'
import PropTypes from 'prop-types'

import { withFormik, Form, Field, yupToFormErrors } from 'formik'
import * as Yup from 'yup'
import Button from '@material-ui/core/Button'
import { TextField } from 'formik-material-ui'
import gql from 'graphql-tag'
import { withRouter } from 'react-router-dom'
import { withFirebase } from '../../components/Firebase'
import { withApollo } from 'react-apollo'
import { compose } from 'recompose'
import { connect } from 'react-redux'
import { setGqlIds, setSnackState, setDialog } from '../../actions'
import {
	EDIT_LECTURE_MUTATION,
	CREATE_LECTURE_MUTATION
} from '../../gql/Mutations'
import { CLASSROOM_QUERY_LOGGEDIN } from '../../gql/Queries';
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

const CreateLectureForm = ({
	values,
	errors,
	touched,
	isSubmitting,
	submitForm,
	edit,
	status
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
					name="liveAt"
					label="lecture begins at"
					component={TextField}
					variant="filled"
				/>
				<Field
					className="form_text_field"
					type="datetime-local"
					name="endAt"
					label="lecture ends at"
					component={TextField}
					variant="filled"
				/>

				<Button
					color="primary"
					variant="contained"
					disabled={isSubmitting}
					onClick={() => {
						submitForm()
					}}>
					{edit ? 'EDIT LECTURE' : 'CREATE LECTURE'}
				</Button>
			</Form>
		</React.Fragment>
	)
}

CreateLectureForm.propTypes = {}

export default compose(
	withRouter,
	withFirebase,
	withApollo,
	connect(
		mapStateToProps,
		mapDispatchToProps
	),
	withFormik({
		mapPropsToValues({ name, description, liveAt, endAt, dataToEdit }) {
			return {
				name: name || dataToEdit ? dataToEdit.name : '',
				description: description || dataToEdit ? dataToEdit.description : '',
				liveAt: liveAt || dataToEdit ? dataToEdit.liveAt.substring(0,16) : '',
				endAt: endAt || dataToEdit ? dataToEdit.endAt.substring(0,16) : ''
			}
		},
		validationSchema: Yup.object().shape({
			name: Yup.string().max(50, `Don't exceed more than 20 characters`),
			description: Yup.string().max(
				100,
				`Don't exceed more than 100 characters`
			),
			liveAt: Yup.date().min(new Date()),
			endAt: Yup.date().min(new Date()),

		}),
		handleSubmit: async (
			values,
			{ resetForm, setErrors, setSubmitting, setStatus, props }
		) => {
			const { name, description, liveAt, endAt } = values
			const { setSnackState, gqlIds, edit } = props
			const batchId = props.batchId ? props.batchId : gqlIds
			const classroomId = props.classroomId ? props.classroomId : gqlIds
			const valuesToEdit = Object.entries(values)
				.filter(val => val[1] !== '')
				.reduce((accum, [k, v]) => {
					accum[k] = v
					return accum
				}, {})
			try {
				if (edit) {
					const response = await props.client.mutate({
						mutation: EDIT_LECTURE_MUTATION,
						variables: {
							...valuesToEdit,
							lectureId: props.lectureId
						},
						refetchQueries: [{
							query: CLASSROOM_QUERY_LOGGEDIN,
							variables: { id: props.classroomId},
						  }],
					})
					resetForm()
					setSnackState({
						message: 'Successfully edited a lecture!',
						variant: 'success',
						open: true
					})
					props.setDialog({open:false})
				} else {
					const response = await props.client.mutate({
						mutation: CREATE_LECTURE_MUTATION,
						variables: {
							name,
							description,
							liveAt,
							endAt,
							classroomId,
							batchId
						},
						refetchQueries: [{
							query: CLASSROOM_QUERY_LOGGEDIN,
							variables: { id: classroomId},
						  }],
					})
					resetForm()
					setStatus({ success: true })
					setSnackState({
						message: 'Successfully created lecture!',
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
)(CreateLectureForm)
