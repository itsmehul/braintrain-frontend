import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Fab from '@material-ui/core/Fab'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import SimpleDialog from '../../components/Dialog'
import CreateLectureForm from '../../components/Forms/CreateLectureForm'
import { setSnackState, setDialog } from '../../actions'
import { connect } from 'react-redux'
import { DELETE_LECTURE_MUTATION } from '../../gql/Mutations'
import { withApollo } from 'react-apollo'
import { compose } from 'recompose'
import { withRouter } from 'react-router-dom'
import * as ROUTES from '../../constants/routes'
import { Button } from '@material-ui/core';
import './Styles.scss'

const mapDispatchToProps = dispatch => {
	return {
		setSnackState: state => dispatch(setSnackState(state)),
		setDialog: state => dispatch(setDialog(state))
	}
}
const mapStateToProps = state => {
	return { snackState: state.myreducer.snackState }
}
const styles = theme => ({
	fab: {
		margin: '4px!important',
		height: '30px',
		width: '30px'
	}
})

function LectureActions(props) {
	const [openLecture, setOpenLecture] = React.useState(false)

	const deleteLecture = () => {
		props.client
			.mutate({
				mutation: DELETE_LECTURE_MUTATION,
				variables: {
					batchId: props.batchId
				}
			})
			.then(response => {
				setSnackState({
					message: 'Successfully deleted a lecture!',
					variant: 'success',
					open: true
				})
				props.history.push(ROUTES.CLASSROOMS)
			})
			.catch(error => {
				console.log(error)
			})
	}
	const { classes } = props
	if (props.create)
		return (
			<React.Fragment>
				<Button
					variant="contained"
					style={{ margin: '1em' }}
					onClick={() => {
						setOpenLecture(true)
						props.setDialog({ open: true })
					}}
					color="secondary">
					CREATE LECTURE
				</Button>
				{openLecture && (
					<SimpleDialog close={() => setOpenLecture(false)}>
						<CreateLectureForm
							classroomId={props.classroomId}
							batchId={props.batchId}
							edit={false}
						/>
					</SimpleDialog>
				)}
			</React.Fragment>
		)
	return (
		<div
			className="floatContainer">
			<Fab
				onClick={() => {
					setOpenLecture(true)
					props.setDialog({ open: true })
				}}
				color="secondary"
				aria-label="Edit"
				className={classes.fab}>
				<EditIcon fontSize="small" />
			</Fab>
			<Fab
				onClick={() => deleteLecture()}
				aria-label="Delete"
				className={classes.fab}>
				<DeleteIcon fontSize="small" />
			</Fab>
			{openLecture && (
				<SimpleDialog close={() => setOpenLecture(false)}>
					<CreateLectureForm lectureId={props.lectureId} edit={true} dataToEdit={props.dataToEdit}/>
				</SimpleDialog>
			)}
		</div>
	)
}

LectureActions.propTypes = {
	classes: PropTypes.object.isRequired
}

export default compose(
	connect(
		mapStateToProps,
		mapDispatchToProps
	),
	withStyles(styles),
	withApollo,
	withRouter
)(LectureActions)
