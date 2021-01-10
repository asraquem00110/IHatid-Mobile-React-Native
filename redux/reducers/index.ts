import { combineReducers } from 'redux'
import authReducer from './auth'
import oauthReducer from './oauth'
import bookingsReducer from './bookings'
import PassengerReducer from './passenger'
import RiderReducer from './driver'

const allReducers = combineReducers({
    auth: authReducer,
    oauth: oauthReducer,
    bookings: bookingsReducer,
    passenger: PassengerReducer,
    rider: RiderReducer,
})

export type RootState = ReturnType<typeof allReducers>

export default allReducers