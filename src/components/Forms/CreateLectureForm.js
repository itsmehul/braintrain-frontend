import React from 'react'
import PropTypes from 'prop-types'

import { withFormik, Form, Field } from 'formik'
import * as Yup from 'yup'
import Button from '@material-ui/core/Button'
import { TextField } from 'formik-material-ui'
import gql from 'graphql-tag'
import { withRouter } from 'react-router-dom'
import { withFirebase } from '../../components/Firebase'
import { withApollo } from 'react-apollo'
import { compose } from 'recompose'
import { connect } from "react-redux";
import { setGqlIds,setSnackState } from "../../actions";
import { EDIT_LECTURE_MUTATION, CREATE_LECTURE_MUTATION } from '../../gql/Mutations';
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
					name="liveAt"
					// label="liveAt"
					component={TextField}
					variant="outlined"
				/>
				<Field
					className="form_text_field"
					type="datetime-local"
					name="endAt"
					// label="endAt"
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
					{edit ? 'EDIT LECTURE' : 'CREATE LECTURE'}
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
	connect(mapStateToProps, mapDispatchToProps),
	withFormik({
		mapPropsToValues({
			name,
			description,
			liveAt,
			endAt,
			
		}) {
			return {
				name: name || '',
				description: description || '',
				liveAt: liveAt || '',
				endAt: endAt || '',
			}
		},
		validationSchema: Yup.object().shape({
			// name: Yup.string()
			// 	.name('name not valid')
			// 	.required('name is required'),
		}),
		handleSubmit(
			values,
			{ resetForm, setErrors, setSubmitting, setStatus, props }
		) {
			const {
				name,
				description,
				liveAt,
				endAt,
				
			} = values
			const {setSnackState, gqlIds, edit} = props						
			const {batchId,classroomId} = gqlIds
			const valuesToEdit = Object.entries(values).filter(val=>val[1]!=='').reduce((accum, [k, v]) => {
				accum[k] = v;
				return accum;
				}, {});
				if (edit) {
					props.client
					.mutate({
						mutation: EDIT_LECTURE_MUTATION,
						variables: {
							...valuesToEdit,
							lectureId:props.lectureId
						}
					})
					.then(response => {
						resetForm()
						setSubmitting(false)
						setStatus({ success: true })
						setGqlIds({ classroomId: response.data.createClassroom.id })
						setSnackState({
							message: 'Successfully created a lecture!',
							variant: 'success',
							open: true
						})
					})
					.catch(error => {
						setErrors({ name: error.message })
					})
				}else{
					props.client
					.mutate({
						mutation: CREATE_LECTURE_MUTATION,
						variables: {
							name,
							description,
							liveAt,
													endAt,
													classroomId,
													batchId
						}
					})
					.then(response => {
						resetForm()
						setSubmitting(false)
						setStatus({ success: true });
						setSnackState({
							message: 'Successfully created a lecture!',
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
