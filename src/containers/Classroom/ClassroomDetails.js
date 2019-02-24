import React from 'react'
import PropTypes from 'prop-types'
import { Query } from 'react-apollo'
import { Button } from '@material-ui/core'
import { AuthUserContext } from '../../components/Session'
import Paper from '@material-ui/core/Paper'
import Group from '@material-ui/icons/Group'

import './index.scss'
import ClassroomActions from '../../components/FloatingActionButton/ClassroomActions'
import BatchAction from '../../components/FloatingActionButton/BatchAction'
import AvatarCard from '../../components/Avatar'
import { CLASSROOM_QUERY_LOGGEDIN, CLASSROOM_QUERY } from '../../gql/Queries';
import LectureCard from '../../components/Lecture';
import { formatDate } from '../../utils/time';
import { JOIN_BATCH_MUTATION } from '../../gql/Mutations';
import { withRouter } from 'react-router-dom'
import { withApollo } from 'react-apollo'
import { compose } from 'recompose'


function ClassroomDetails(props) {
	const classid = props.match.params.id
    function joinBatch(batchId, classroomId){
        props.client
        .mutate({
            mutation: JOIN_BATCH_MUTATION,
            variables: {
				batchId,
				classroomId
            }
        })
        .then(response => {
            console.log(response)
        })
        .catch(error => {
            console.log(error)
        })
    }
	return (
		<div className="page" style={{ backgroundColor: '#e0e0e0' }}>
			<AuthUserContext.Consumer>
				{authUser => (
					<Query
						query={authUser ? CLASSROOM_QUERY_LOGGEDIN : CLASSROOM_QUERY}
						variables={{ id:classid }}>
						{({ loading, error, data }) => {
							if (loading) return 'Loading...'
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
											{myclass && (
												<ClassroomActions classroomId={id} />
											)}
											<div style={{padding:'7px'}}>
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
											<Paper className="batch">
												{myclass && <BatchAction batchId={batch.id} />}
												<div className="batch_heading">
													<h3>{batch.name}</h3>
													<div className="meta">
														<p>{batch.students&&batch.students.length}  <Group fontSize="small"/></p>
														<p className="days_left">{formatDate(batch.startsFrom)}</p>
													</div>
													<div className="joinbatch">
														<Button  onClick={()=>joinBatch(batch.id, id)} variant="contained">Join Batch</Button>
													</div>
												</div>
												{batch.lectures.map(lecture => (
													<LectureCard lecture={lecture} batchId={batch.id} myclass={myclass}/>
												))}
											</Paper>
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

ClassroomDetails.propTypes = {}

export default compose(withApollo,withRouter)(ClassroomDetails)
