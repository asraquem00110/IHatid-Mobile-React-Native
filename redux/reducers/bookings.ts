import {ActionsType, Actions} from '../actions/bookings'

export interface IDriverInfo {
    motorcyle: {
        motorcycle: string,
        description: string,
        plateno: string
        registrationNo: string
      },
    email: string,
    fullname: string,
    contactno: string,
    _id: string,
    picture: string,
}

export interface IBookingState {
    pickup: {
        place: string,
        latitude: number,
        longitude: number
    },
    dropoff: {
        place: string,
        latitude: number,
        longitude: number,
    },
    distance: {
        text: string,
        value: number,
    },
    traveltime: string,
    price: number,
    Booking: {
        id: string,
        status: number,
        driverID: IDriverInfo
    },
    mylocation: {
        latitude: number,
        longitude: number,
    }
}

export const initialState: IBookingState = {
    pickup: {
        place: '',
        latitude: 0,
        longitude: 0,
    },
    dropoff: {
        place: '',
        latitude: 0,
        longitude: 0,
    },
    distance: {
        text: '',
        value: 0,
    },
    traveltime: '',
    price: 0,
    Booking: {
        id: '',
        status: 0,
        driverID: {
            motorcyle: {
                motorcycle: '',
                description: '',
                plateno: '',
                registrationNo: ''
              },
            email: '',
            fullname: '',
            contactno: '',
            _id: '',
            picture: '',
        },
        
    },
    mylocation: {
        latitude: 0,
        longitude: 0,
    }
}

const bookingsReducer = (state: IBookingState = initialState , actions: ActionsType) => {
    switch(actions.type){
        case Actions.setPickupAt:
            state.pickup.place = actions.payload.name
            state.pickup.latitude = actions.payload.lat
            state.pickup.longitude = actions.payload.lng
            return {...state}
        case Actions.setDropoff: 
            state.dropoff.place = actions.payload.name
            state.dropoff.latitude = actions.payload.lat
            state.dropoff.longitude = actions.payload.lng
            return {...state}
        case Actions.setOtherInfo:
            state.distance = actions.payload.destination
            state.traveltime = actions.payload.traveltime
            state.price =  actions.payload.price
            return {...state}
        case Actions.setActiveBook: 
            state.Booking.id = actions.payload.details._id || '',
            state.Booking.status = actions.payload.details.status || 0
            state.Booking.driverID = actions.payload.details.driverID || {email: '',fullname: '',contactno: '',_id: ''}
            state.pickup = {
                place: actions.payload.details.origin.place || '',
                latitude: actions.payload.details.origin.latitude || 0,
                longitude: actions.payload.details.origin.longitude || 0,
            }
            state.dropoff = {
                place: actions.payload.details.destination.place || '',
                latitude: actions.payload.details.destination.latitude || 0,
                longitude: actions.payload.details.destination.longitude || 0,
            }
            return {...state}
        case Actions.cancelBooking:
            state.Booking.id = ''
            state.Booking.status = 0
            return {...state}
        case Actions.setDriverInfo:
            state.Booking.status = 1
            state.Booking.driverID = actions.payload.driverID
            return {...state}
        default: 
            return state
    }
}

export default bookingsReducer