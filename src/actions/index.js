import { SET_GQL_IDS, SET_SNACKSTATE, SET_DIALOG } from '../constants/actionTypes'
import { SET_USER_DATA } from '../constants/actionTypes';


export function setUserData(payload){
    return {type: SET_USER_DATA, payload}
}

export function setGqlIds(payload){
    return {type: SET_GQL_IDS, payload}
}

export function setSnackState(payload){
    return {type: SET_SNACKSTATE, payload}
}

export function setDialog(payload){
    return {type: SET_DIALOG, payload}
}