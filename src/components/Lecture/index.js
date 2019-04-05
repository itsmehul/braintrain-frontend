import React from 'react'
import './index.scss'
import LectureAction from '../FloatingActionButton/LectureAction'
import { getDaysLeft, formatDate, convertDateToGMT } from '../../utils/time'
import Group from '@material-ui/icons/Group'
import { Button } from '@material-ui/core'
import * as ROUTES from '../../constants/routes'
import { withRouter } from 'react-router-dom'
import { withApollo } from 'react-apollo'
import { compose } from 'recompose'
import { JOIN_LECTURE_MUTATION } from '../../gql/Mutations'
import { setSnackState } from '../../actions';
import { connect } from 'react-redux'

const LectureCard = ({ lecture, myclass, batchId, client, history, match }) => {
	const DAYS_LEFT = getDaysLeft(lecture.liveAt)
	async function joinClass() {
		try {
			await client.mutate({
				mutation: JOIN_LECTURE_MUTATION,
				variables: {
					lectureId: lecture.id,
					batchId
				}
			})
			history.push(ROUTES.ROOM + '/' + lecture.id)
		} catch (error) {
			setSnackState({
				message: error.message,
				variant: 'error',
				open: true
			})
		}
	}
	let {liveAt, endAt} = lecture
	liveAt = new Date(liveAt)
	endAt = new Date(endAt)
	let date = new Date()
	const CAN_JOIN = liveAt<date&&date<endAt
	return (
		<div className="lectures">
			{myclass && <LectureAction lectureId={lecture.id} dataToEdit={lecture} />}
			<div className="lecture_heading">
				<h3>{lecture.name}</h3>
				<p>
					{lecture.students && lecture.students.length}{' '}
					<Group fontSize="small" />
				</p>
				{(CAN_JOIN) ? (
					<Button onClick={joinClass} className="days_left" variant="outlined" >
						JOIN
					</Button>
				) : (
					<p className="days_left">{(DAYS_LEFT!==0)?`In ${DAYS_LEFT} days`:`In ${(Math.abs(liveAt - date) / 36e5).toFixed(0)} hours`}</p>
				)}
			</div>
		</div>
	)
}

const mapDispatchToProps = dispatch => {
	return {
		setSnackState: state => dispatch(setSnackState(state)),
	}
}

export default compose(
	withApollo,
	withRouter,
	connect(
		null,
		mapDispatchToProps
	)
)(LectureCard)
