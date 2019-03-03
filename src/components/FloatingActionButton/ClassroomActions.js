import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Fab from '@material-ui/core/Fab'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import SimpleDialog from '../../components/Dialog'
import CreateClassroomForm from '../../components/Forms/CreateClassroomForm'
import { setSnackState, setDialog } from '../../actions'
import { connect } from 'react-redux'
import { DELETE_CLASSROOM_MUTATION } from '../../gql/Mutations'
import { withApollo } from 'react-apollo'
import { compose } from 'recompose'
import { withRouter } from 'react-router-dom'
import * as ROUTES from '../../constants/routes'
import { Button } from '@material-ui/core';
import { CLASSROOMS_QUERY } from '../../gql/Queries';

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

function ClassroomActions(props) {
	const [openClassroom, setOpenClassroom] = React.useState(false)
	const deleteClassroom = () => {
		props.client
			.mutate({
				mutation: DELETE_CLASSROOM_MUTATION,
				variables: {
					classroomId: props.classroomId
				},
				refetchQueries: [{
					query: CLASSROOMS_QUERY,
				  }],
			})
			.then(response => {
				setSnackState({
					message: 'Successfully deleted a classroom!',
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
	if(props.create) return(<React.Fragment><Button
		variant="contained"
		style={{margin:"1em"}}
		onClick={() => {setOpenClassroom(true);props.setDialog({ open: true })}}
			color="secondary">
			CREATE CLASSROOM
		</Button>
		{openClassroom&&<SimpleDialog close={()=>setOpenClassroom(false)}>		
		<CreateClassroomForm classroomId={props.classroomId} edit={false} />
				</SimpleDialog>}</React.Fragment>)
	return (
		<div style={{ position: 'absolute', right: 0, zIndex: 5}}>
			<Fab
				onClick={() => {setOpenClassroom(true);props.setDialog({ open: true })}}
				color="secondary"
				aria-label="Edit"
				className={classes.fab}>
				<EditIcon fontSize="small"/>
			</Fab>
			<Fab
				onClick={() => deleteClassroom()}
				aria-label="Delete"
				className={classes.fab}>
				<DeleteIcon fontSize="small"/>
			</Fab>
			{openClassroom&&<SimpleDialog close={()=>setOpenClassroom(false)}>
				<CreateClassroomForm classroomId={props.classroomId} edit={true} dataToEdit={props.dataToEdit} />
			</SimpleDialog>}
		</div>
	)
}

ClassroomActions.propTypes = {
	classes: PropTypes.object.isRequired
}

export default compose(
	connect(
		mapStateToProps,
		mapDispatchToProps
	),
	withStyles(styles),
	withApollo,
	withRouter,

)(ClassroomActions)
