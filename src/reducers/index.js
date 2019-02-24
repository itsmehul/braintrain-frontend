import {
	SET_USER_DATA,
	SET_GQL_IDS,
	SET_SNACKSTATE,
	SET_DIALOG
} from '../constants/actionTypes'
const initialState = {
	gqlIds: {
		classroomId: null,
		batchId: null
	},
	snackState: {
		message: '',
		variant: '',
		open: false
	},
	user: null,
	dialogState: {
		open: false
	}
}
function myreducer(state = initialState, action) {
	if (action.type === SET_USER_DATA) {
		return Object.assign({}, state, {
			user: {...action.payload}
		})
	}
	if (action.type === SET_GQL_IDS) {
		return Object.assign({}, state, {
			gqlIds: { ...state.gqlIds, ...action.payload }
		})
	}
	if (action.type === SET_SNACKSTATE) {
		return {
			...state,
			snackState: {
				...state.snackState,
				...action.payload
			}
		}
	}
	if (action.type === SET_DIALOG) {
		return {
			...state,
			dialogState: {
				...state.dialogState,
				...action.payload
			}
		}
	}
	return state
}
export default myreducer
