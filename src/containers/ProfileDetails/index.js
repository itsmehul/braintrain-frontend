import React from 'react'
import './index.scss'
import { withApollo, Query } from 'react-apollo'
import ClassroomCreationStepper from '../../components/Stepper/ClassroomCreation'
import SimpleDialog from '../../components/Dialog'
import { connect } from 'react-redux'
import { Button } from '@material-ui/core'
import { setSnackState, setDialog } from '../../actions'
import AvatarCard from '../../components/Avatar'
import { USER_QUERY } from '../../gql/Queries'
import { compose } from 'recompose'
import LoadingBar from '../../components/ProgressIndicators/LoadingBar';

const mapDispatchToProps = dispatch => {
	return {
		setSnackState: state => dispatch(setSnackState(state)),
		setDialog: state => dispatch(setDialog(state))
	}
}
const mapStateToProps = state => {
	return { snackState: state.myreducer.snackState, user: state.myreducer.user }
}

const Profile = props => {
	return(<Query
		query={USER_QUERY}>
		{({ loading, error, data }) => {
			if (loading) return <LoadingBar />
			if (error) return `Error! ${error.message}`
			const user = data.myprofile
			return (
				<div className="page">
					<div className="grid-container">
						<div className="classroom_desc" />
						<div className="avatar_cardg">
							<AvatarCard user={user} />
							<React.Fragment>
								<Button onClick={() => props.setDialog({ open: true })}>
									Create Classroom
								</Button>
								<SimpleDialog>
									<ClassroomCreationStepper edit={false} />
								</SimpleDialog>
							</React.Fragment>
						</div>
						<div className="lecture_list" />
					</div>
				</div>
			)
		}}
	</Query>)
}
export default compose(
	withApollo,
	connect(
		mapStateToProps,
		mapDispatchToProps
	)
)(Profile)
