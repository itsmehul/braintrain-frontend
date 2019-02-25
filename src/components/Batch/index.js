import React from 'react'
import './index.scss'
import LectureAction from '../FloatingActionButton/LectureAction'
import { getDaysLeft, formatDate } from '../../utils/time'
import Group from '@material-ui/icons/Group'
import { Button } from '@material-ui/core'
import * as ROUTES from '../../constants/routes'
import { withRouter } from 'react-router-dom'
import { withApollo } from 'react-apollo'
import { compose } from 'recompose'
import { JOIN_BATCH_MUTATION } from '../../gql/Mutations'
import Paper from '@material-ui/core/Paper'
import BatchAction from '../../components/FloatingActionButton/BatchAction'
import { connect } from 'react-redux'

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
	const studentIn = user.studentIn
	React.useEffect(
		() =>
			setIsMember(
				studentIn
					.reduce((a, c) => a.batches.concat(c.batches))
					.some(b => b.id === batch.id)
			),
		[isMember]
	)
	console.log(isMember)
	async function joinBatch(batchId, classroomId) {
		try {
			// let request = new PaymentRequest(methods, details, options)
			// const PaymentResponse = await request.show()
			// console.log(PaymentResponse)

			const response = await client.mutate({
				mutation: JOIN_BATCH_MUTATION,
				variables: { batchId, classroomId }
			})
			setIsMember(true)
		} catch (error) {
			console.log(error)
		}
	}
	return (
		<Paper className="batch">
			{myclass && <BatchAction batchId={batch.id} />}
			<div className="batch_heading">
				<h3>{batch.name}</h3>
				{isMember ? (
					<div className="meta">
						<p>
							{batch.students && batch.students.length}{' '}
							<Group fontSize="small" />
						</p>
						<p className="days_left">{formatDate(batch.startsFrom)}</p>
					</div>
				) : (
					<div className="joinbatch">
						<Button
							onClick={() => joinBatch(batch.id, classroomId)}
							variant="contained">
							Join Batch
						</Button>
					</div>
				)}
			</div>
			{isMember ? (
				children
			) : (
				<Paper style={{ padding: '1em' }}>
                <h4 style={{margin:'0px'}}>Description:</h4>
					<h5 style={{margin:'10px 0 0 0'}}>{batch.description}</h5>
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
