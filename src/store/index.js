import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import thunk from 'redux-thunk'
import myreducer from "../reducers/index";
import {reducer, createStore as createStoreTest } from "@andyet/simplewebrtc";


const rootReducer = combineReducers({simplewebrtc:reducer
    , myreducer
})

// const store = createStoreTest()
const store = createStore(rootReducer, {}, compose(applyMiddleware(thunk)))
export default store;