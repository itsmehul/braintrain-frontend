import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Fab from '@material-ui/core/Fab'
import DeleteIcon from '@material-ui/icons/Delete'
import EditIcon from '@material-ui/icons/Edit'
import AddIcon from '@material-ui/icons/Add'
import SimpleDialog from '../../components/Dialog'
import CreateBatchForm from '../../components/Forms/CreateBatchForm'
import { setSnackState, setDialog } from '../../actions'
import { connect } from 'react-redux'
import { DELETE_BATCH_MUTATION } from '../../gql/Mutations'
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

function BatchActions(props) {
    const [openBatch, setOpenBatch] = React.useState(false)
    const [edit, setEdit] = React.useState(false)

	const deleteBatch = () => {
		props.client
			.mutate({
				mutation: DELETE_BATCH_MUTATION,
				variables: {
					batchId: props.batchId
				}
			})
			.then(response => {
				setSnackState({
					message: 'Successfully deleted a batch!',
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
		onClick={() => {setOpenBatch(true);props.setDialog({ open: true });setEdit(false)}}
		color="secondary">
		CREATE BATCH
	</Button>
	{openBatch&&<SimpleDialog  close={()=>setOpenBatch(false)}>
				<CreateBatchForm classroomId={props.classroomId} batchId={props.batchId} edit={edit} />
			</SimpleDialog>}</React.Fragment>)
	return (
		<div className="floatContainer">
				<Fab
				onClick={() => {setOpenBatch(true);props.setDialog({ open: true });setEdit(true)}}
				color="secondary"
				aria-label="Edit"
				className={classes.fab}>
				<EditIcon fontSize="small"/>
				</Fab>
				<Fab
				onClick={() => deleteBatch()}
				aria-label="Delete"
				className={classes.fab}>
				<DeleteIcon fontSize="small"/>
				</Fab>
			{openBatch&&<SimpleDialog  close={()=>setOpenBatch(false)}>
				<CreateBatchForm classroomId={props.classroomId} batchId={props.batchId} edit={edit} />
			</SimpleDialog>}
	</div>
	)
}

BatchActions.propTypes = {
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

)(BatchActions)
