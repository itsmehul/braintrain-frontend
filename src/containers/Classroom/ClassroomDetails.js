import React from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import { Button } from '@material-ui/core'
import { AuthUserContext } from '../../components/Session'
import Paper from '@material-ui/core/Paper'
import Group from '@material-ui/icons/Group'
import { connect } from "react-redux";

import './index.scss'
import ClassroomActions from '../../components/FloatingActionButton/ClassroomActions'
import BatchAction from '../../components/FloatingActionButton/BatchAction'
import AvatarCard from '../../components/Avatar'
import { CLASSROOM_QUERY_LOGGEDIN, CLASSROOM_QUERY } from '../../gql/Queries'
import LectureCard from '../../components/Lecture'
import { formatDate } from '../../utils/time'
import { JOIN_BATCH_MUTATION } from '../../gql/Mutations'
import { withRouter } from 'react-router-dom'
import { withApollo } from 'react-apollo'
import { compose } from 'recompose'
import BatchCard from '../../components/Batch';
import { showLoading, hideLoading, LoadingBar } from 'react-redux-loading-bar'


class ClassroomDetails extends React.Component{
	componentWillMount = () => {
		this.classId=this.props.match.params.id
	}
	
	
	render(){
		console.log(this.props.showLoading())
	return (
		<div className="page" style={{ backgroundColor: '#e0e0e0' }}>
			<AuthUserContext.Consumer>
				{authUser => (
					<Query
						query={authUser ? CLASSROOM_QUERY_LOGGEDIN : CLASSROOM_QUERY}
						variables={{ id: this.classId }}>
						{({ loading, error, data }) => {
							if (loading) return 'Loading..'
							if (error) return `Error! ${error.message}`
							const {
								id,
								name,
								batches,
								myclass,
								description,
								teacher,
								learning,
								language,
								requirements,
								objectives
							} = data.classroom
							return (
								<React.Fragment>
									<div className="sidebar">
										<Paper className="classroom_card">
											{myclass && <ClassroomActions classroomId={id} />}
											<div style={{ padding: '7px' }}>
												<h2>{name}</h2>
												<p>About</p>
												<h6>{description}</h6>

												<p>Objectives</p>
												<h6>{objectives}</h6>

												<p>Details</p>

												{/* <h6>
													<b>LECTURES: </b>
													{lecture_count} lectures
												</h6>  */}

												<h6>
													<b>LEARNING: </b>
													{learning}
												</h6>
												<h6>
													<b>LANGUAGE: </b>
													{language}{' '}
												</h6>
												<h6>
													<b>REQUIREMENTS: </b>
													{requirements}{' '}
												</h6>
											</div>
										</Paper>

										<AvatarCard user={teacher} />
									</div>
									<div className="main">
										{batches.map(batch => (
											<BatchCard batch={batch} classroomId={id} myclass={myclass}>
												{batch.lectures.map(lecture => (
													<LectureCard
														lecture={lecture}
														batchId={batch.id}
														myclass={myclass}
													/>
												))}
											</BatchCard>
										))}
									</div>
								</React.Fragment>
							)
						}}
					</Query>
				)}
			</AuthUserContext.Consumer>
		</div>
	)
}
}
ClassroomDetails.propTypes = {}

const mapDispatchToProps = dispatch=>({
	showLoading: ()=>dispatch(showLoading()),
	hideLoading: ()=>dispatch(hideLoading())
})

export default compose(
	withApollo,
	withRouter,
	connect(
		null,
		mapDispatchToProps
	)
)(ClassroomDetails)
