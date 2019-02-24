import React from 'react'
import { Query } from 'react-apollo'
import Paper from '@material-ui/core/Paper'
import { withStyles } from '@material-ui/core/styles'
import { Link } from 'react-router-dom'
import * as ROUTES from '../../constants/routes'
import './index.scss'
import { CLASSROOMS_QUERY } from '../../gql/Queries'

const styles = theme => ({})

const ClassroomsPage = props => {
	const { classes } = props

	return (
		<div className="page">
			<Query query={CLASSROOMS_QUERY}>
				{({ loading, error, data }) => {
					if (loading)
						return (
							<img
							alt="loading"
								src="./assets/bookflip.ico"
								width="300px"
								height="300px"
								style={{
									marginLeft: 'auto',
									marginRight: 'auto',
									display: 'block',
									backgroundColor: '#e0e0e0'
								}}
							/>
						)
					if (error) return <div>Error</div>
					const classrooms = data.classrooms
					return (
						<ul
							className="reset m1"
							style={{
								display: 'grid',
								gridGap: '20px',
								gridTemplateColumns: 'repeat( auto-fit, minmax(300px, 1fr) )'
							}}>
							{classrooms.map((classroom,i) => (
								<Link key={i} to={ROUTES.CLASSROOMS + '/' + classroom.id}>
									<li className="reset hcenter" key={classroom.id}>
										<Paper className="classrooms_card">
											<div
												className="header_img"
												style={{
													backgroundImage: `${
														classroom.classroomImage
															? `url(${classroom.classroomImage})`
															: 'url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSRHK4MSNPxUdhOpcor8cZ2Vtum8QqFg37WEivLYJPYChWDYCj)'
													}`,
													backgroundPosition: 'center'
												}}
											/>
											<img alt="display picture" src={(classroom.teacher.dpUrl)?classroom.teacher.dpUrl:"http://pravatar.cc/300"} />

											<div className="classroom_body">
												<h2>
													<mark>{classroom.name}</mark>
												</h2>
												<h6>{classroom.description}</h6>
											</div>
										</Paper>
									</li>
								</Link>
							))}
						</ul>
					)
				}}
			</Query>
		</div>
	)
}

export default withStyles(styles)(ClassroomsPage)
