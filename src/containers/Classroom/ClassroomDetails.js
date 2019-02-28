import React from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import { AuthUserContext } from '../../components/Session'
import Paper from '@material-ui/core/Paper'
import { connect } from "react-redux";

import './index.scss'
import ClassroomActions from '../../components/FloatingActionButton/ClassroomActions'
import AvatarCard from '../../components/Avatar'
import { CLASSROOM_QUERY_LOGGEDIN, CLASSROOM_QUERY } from '../../gql/Queries'
import LectureCard from '../../components/Lecture'
import { withRouter } from 'react-router-dom'
import { withApollo } from 'react-apollo'
import { compose } from 'recompose'
import BatchCard from '../../components/Batch';
import LoadingBar from '../../components/ProgressIndicators/LoadingBar';
import BatchAction from '../../components/FloatingActionButton/BatchAction';


class ClassroomDetails extends React.Component{
	componentWillMount = () => {
		this.classId=this.props.match.params.id
	}
	
	
	render(){
	return (
		<div className="page" style={{ backgroundColor: '#e0e0e0' }}>
			<AuthUserContext.Consumer>
				{authUser => (
					<Query
						query={authUser ? CLASSROOM_QUERY_LOGGEDIN : CLASSROOM_QUERY}
						variables={{ id: this.classId }}>
						{({ loading, error, data }) => {
							if (loading) return <LoadingBar/>
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

										{myclass?(<div style={{position:"relative", display:"flex", justifyContent:"center", marginTop:"7px"}}><BatchAction classroomId={id} create={true} /></div>):(<AvatarCard user={teacher} />)}
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

export default compose(
	withApollo,
	withRouter,
)(ClassroomDetails)
