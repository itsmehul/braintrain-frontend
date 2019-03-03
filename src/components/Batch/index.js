import React from 'react'
import './index.scss'
import { getDaysLeft, formatDate } from '../../utils/time'
import Group from '@material-ui/icons/Group'
import { Button } from '@material-ui/core'
import { withRouter } from 'react-router-dom'
import { withApollo } from 'react-apollo'
import { compose } from 'recompose'
import { JOIN_BATCH_MUTATION } from '../../gql/Mutations'
import Paper from '@material-ui/core/Paper'
import BatchAction from '../../components/FloatingActionButton/BatchAction'
import { connect } from 'react-redux'
import { AuthUserContext } from '../../components/Session'
import LectureAction from '../FloatingActionButton/LectureAction'
import { reflectAll } from 'async'
import { CLASSROOM_QUERY_LOGGEDIN } from '../../gql/Queries'

const BatchCard = ({
	batch,
	classroomId,
	myclass,
	children,
	client,
	history,
	user
}) => {
	const [isMember, setIsMember] = React.useState(false)
	if (user !== null) {
		React.useEffect(() => {
			setIsMember(batch.students.some(a => a.id === user.id))
		})
	}
	async function joinBatch(batchId, classroomId) {
		try {
			const response = await fetch(
				`/pay/${classroomId}/${batchId}/${user.id}`,
				{
					method: 'POST',
					credentials: 'include',
					headers: {
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						fee: batch.fee,
						name: batch.name
					})
				}
			)

			let url = await response.json()
			window.location = url.links[1].href
		} catch (error) {
			return console.log(error)
		}
	}

	return (
		<Paper className="batch">
			{myclass && (
				<BatchAction
					create={false}
					batchId={batch.id}
					dataToEdit={batch}
					classroomId={classroomId}
				/>
			)}
			{myclass && (
				<LectureAction
					create={true}
					batchId={batch.id}
					classroomId={classroomId}
				/>
			)}
			<div className="batch_heading">
				<h3>{batch.name}</h3>
				{isMember || myclass ? (
					<div className="meta">
						<p>
							{batch.students && batch.students.length}{' '}
							<Group fontSize="small" />
						</p>
						<p className="days_left">{formatDate(batch.startsFrom)}</p>
					</div>
				) : (
					<AuthUserContext.Consumer>
						{authUser =>
							authUser ? (
								<div className="joinbatch">
									<Button
										onClick={() => joinBatch(batch.id, classroomId)}
										variant="contained">
										Join Batch @{batch.fee}INR
									</Button>
								</div>
							) : null
						}
					</AuthUserContext.Consumer>
				)}
			</div>
			{isMember || myclass ? (
				children
			) : (
				<Paper style={{ padding: '1em' }}>
					<h4 style={{ margin: '0px' }}>Description:</h4>
					<h5 style={{ margin: '10px 0 0 0' }}>{batch.description}</h5>
				</Paper>
			)}
		</Paper>
	)
}
const mapStateToProps = state => ({
	user: state.myreducer.user
})

const mapDispatchToProps = {}
export default compose(
	withApollo,
	withRouter,
	connect(
		mapStateToProps,
		mapDispatchToProps
	)
)(BatchCard)
