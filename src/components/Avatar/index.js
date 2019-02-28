import React from 'react'
import './index.scss'
import { Paper } from '@material-ui/core'
import { formatDate } from '../../utils/time';

export default function AvatarCard({ user }) {
  const { createdAt, name, role, profession, dpUrl, email, description, teacherIn, studentIn } = user
  console.log(user)
	return (
		<Paper className="avatar_card">
			<h6>
					{role}
				</h6>
			<img src={(dpUrl)?dpUrl:"/assets/avatar-img.png"}  />
			<h2>{name}</h2>
			<h6 className="about">{description}<br/>User since {formatDate(createdAt)}</h6>
			<div className="meta">
				<h6>
					<b>Profession</b>
					{profession}
				</h6>

				<h6>
					<b>Student in</b> {studentIn ? studentIn.length : 0} classroooms{' '}
				</h6>
				<h6>
					<b>Teacher in</b> {teacherIn ? teacherIn.length : 0} classrooms
				</h6>
				<h6>
					<b>Speaks:</b>English, Hindi
				</h6>
				<h6>
					<b>Rating:</b> 4.6
				</h6>
			</div>
		</Paper>
	)
}
