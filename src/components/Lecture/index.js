import React from 'react'
import './index.scss'
import LectureAction from '../FloatingActionButton/LectureAction';
import { getDaysLeft, formatDate } from '../../utils/time';
import Group from '@material-ui/icons/Group'
import { Button } from '@material-ui/core';
import * as ROUTES from '../../constants/routes'
import { withRouter } from 'react-router-dom'
import { withApollo } from 'react-apollo'
import { compose } from 'recompose'
import { JOIN_LECTURE_MUTATION } from '../../gql/Mutations';

const LectureCard = ({lecture, myclass, batchId, client, history}) => {
    const DAYS_LEFT = getDaysLeft(lecture.liveAt)
    function joinClass(lectureId, batchId){
        client
        .mutate({
            mutation: JOIN_LECTURE_MUTATION,
            variables: {
                lectureId,
                batchId
            }
        })
        .then(response => {
            console.log(response)
            history.push(ROUTES.ROOM+'/'+lecture.id)
        })
        .catch(error => {
            console.log(error)
        })
    }
	return (
		<div className="lectures">
			{myclass && <LectureAction lectureId={lecture.id} dataToEdit={lecture}/>}
			<div className="lecture_heading">
				<h3>{lecture.name}</h3>
				<p>{lecture.students && lecture.students.length} <Group fontSize="small"/></p>
				{(DAYS_LEFT!==0)?<Button onClick={()=>joinClass(lecture.id, batchId)} className="days_left" variant="outlined">JOIN</Button>:<p className="days_left">In {DAYS_LEFT} days</p>}
			</div>
		</div>
	)
}

export default compose(withApollo,withRouter)(LectureCard)
