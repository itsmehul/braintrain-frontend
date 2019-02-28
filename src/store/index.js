import { createStore, combineReducers, compose, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import myreducer from '../reducers/index'
import { reducer } from '@andyet/simplewebrtc'
import { loadingBarReducer } from 'react-redux-loading-bar'
import { loadingBarMiddleware } from 'react-redux-loading-bar'

const rootReducer = combineReducers({
	simplewebrtc: reducer,
	myreducer
})

// const store = createStoreTest()
const store = createStore(
	rootReducer,
	{},
	compose(applyMiddleware(thunk))
)
export default store
