import gql from 'graphql-tag'

export const CLASSROOMS_QUERY = gql`
	query ClassroomsQuery {
		classrooms {
			createdAt
			id
			name
			description
			classroomImage
			students {
				name
			}
			teacher {
				name
				dpUrl
			}
		}
	}
`

export const CLASSROOM_QUERY = gql`
	query ClassroomsQuery($id: ID!) {
		classroom(id: $id) {
			id
			name
			description
			learning
			language
			requirements
			objectives
			batches {
				id
				name
				startsFrom
				lectures {
					id
					name
					liveAt
					students{
					name
				}
				}
				students{
					name
				}
			}
			students {
				name
			}
			teacher {
				name
				email
				description
				profession
				role
				dpUrl
				teacherIn {
					name
				}
				studentIn {
					name
				}
			}
		}
	}
`

export const CLASSROOM_QUERY_LOGGEDIN = gql`
	query ClassroomsQuery($id: ID!) {
		classroom(id: $id) {
			id
			name
			description
			learning
			language
			requirements
			objectives
			batches {
				id
				name
				startsFrom
				lectures {
					id
					name
					students{
					name
				}
				liveAt
				}
				students{
					name
				}
			}
			students {
				name
			}
			teacher {
				name
				email
				description
				role
				profession
				dpUrl
				teacherIn {
					name
				}
				studentIn {
					name
				}
			}
			myclass
		}
	}
`

export const USER_QUERY = gql`
    query UserQuery {
											myprofile {
                        createdAt
												name
												role
                        profession
                        description
                        dpUrl 
                        email
                        teacherIn{
                          name
                        }
                        studentIn{
                          name
                        }
											}
										}
  `;