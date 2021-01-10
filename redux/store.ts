
import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import allReducers from './reducers/index'

let initialState: any = {}
const middleware: any = [thunk]
export const store = createStore(
  allReducers,
  initialState, composeWithDevTools(applyMiddleware(...middleware),
))
