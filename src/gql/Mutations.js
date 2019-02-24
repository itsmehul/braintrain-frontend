import gql from 'graphql-tag'

export const CREATE_CLASSROOM_MUTATION = gql`
	mutation createClassroomMutation(
		$name: String!
		$description: String!
		$learning: String!
		$language: String!
		$requirements: String!
		$objectives: String!
		$classroomImage: String!
	) {
		createClassroom(
			name: $name
			description: $description
			learning: $learning
			language: $language
			requirements: $requirements
			objectives: $objectives
			classroomImage: $classroomImage
		) {
			id
		}
	}
`

export const CREATE_BATCH_MUTATION = gql`
				mutation createBatchMutation(
					$name: String!
					$description: String!
					$startsFrom: String
					$fee: Float
					$classroomId: ID
				) {
					createBatch(
						name: $name
						description: $description
						startsFrom: $startsFrom
						fee: $fee
						classroomId: $classroomId
					) {
						id
					}
				}
			`

export const CREATE_LECTURE_MUTATION = gql`
				mutation createLectureMutation(
					$name: String! $description: String, $liveAt: String, $endAt: String, $classroomId:ID!, $batchId: ID!
				) {
					createLecture(
						name: $name
						description: $description
						liveAt: $liveAt
						endAt: $endAt
						classroomId: $classroomId
						batchId: $batchId
					) {
						id
					}
				}
			`


export const EDIT_CLASSROOM_MUTATION = gql`
	mutation updateClassroomMutation(
		$name: String
		$description: String
		$learning: String
		$language: String
		$requirements: String
		$objectives: String
		$classroomId: ID!
		$classroomImage:String
	) {
		updateClassroom(
			name: $name
			description: $description
			learning: $learning
			language: $language
			requirements: $requirements
			objectives: $objectives
			classroomId: $classroomId
			classroomImage: $classroomImage
		) {
			id
		}
	}
`

export const EDIT_BATCH_MUTATION = gql`
				mutation updateBatchMutation( $name: String $description: String $startsFrom: String $fee: Float, $batchId: ID!) {
					updateBatch(
						name: $name
						description: $description
						startsFrom: $startsFrom
						fee: $fee
						batchId: $batchId
					) {
						id
					}
				}
			`

export const EDIT_LECTURE_MUTATION = gql`
				mutation updateLectureMutation($name: String $description: String, $liveAt: String, $endAt: String, $lectureId: ID!) {
					updateLecture(
						name: $name
						description: $description
						liveAt: $liveAt
						endAt: $endAt
						lectureId: $lectureId
					) {
						id
					}
				}
			`
export const DELETE_CLASSROOM_MUTATION = gql`
	mutation deleteClassroomMutation($classroomId: ID!) {
		deleteClassroom(classroomId: $classroomId) {
			name
		}
	}
`

export const DELETE_BATCH_MUTATION = gql`
	mutation deleteBatchMutation($batchId: ID!) {
		deleteBatch(batchId: $batchId) {
			name
		}
	}
`

export const DELETE_LECTURE_MUTATION = gql`
	mutation deleteLectureMutation($lectureId: ID!) {
		deleteLecture(lectureId: $lectureId) {
			name
		}
	}
`

export const JOIN_LECTURE_MUTATION = gql`
mutation joinLectureMutation($lectureId: ID! $batchId: ID!) {
	joinLiveLecture(lectureId: $lectureId, batchId: $batchId) {
		id
	}
}
`


export const JOIN_BATCH_MUTATION = gql`
mutation joinBatchMutation($batchId: ID! $classroomId: ID!) {
	joinBatch(batchId: $batchId, classroomId: $classroomId) {
		id
	}
}
`

export const SIGNUP_MUTATION = gql`
mutation SignupMutation(
  $email: String!
  $fid: String!
  $name: String!
  $dpUrl: String
) {
  signup(email: $email, fid: $fid, name: $name, dpUrl: $dpUrl) {
	token
  }
}
`;

export const EDIT_USER_MUTATION = gql`
mutation EditUserMutation(
  $name: String $description: String $profession: String $dpUrl: String
) {
  updateUser(name: $name, description: $description, profession: $profession, dpUrl: $dpUrl) {
	name
  }
}
`;

export const LOGIN_MUTATION = gql`
mutation LoginMutation($email: String!, $fid: String!) {
	login(email: $email, fid: $fid) {
		token
		user{
			role
		}
	}
}
`