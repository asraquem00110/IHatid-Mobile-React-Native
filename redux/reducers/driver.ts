import { Actions, ActionsType } from "../actions/driver"

export interface IPendingBook {
    origin: {
        place: string,
        latitude: number,
        longitude: number,
    },
    destination: {
        place: string,
        latitude: number,
        longitude: number,
    },
    distance: {
        text: string,
        value: number
    },
    ratings: {
        rate: number,
        rated: boolean
    },
    passengerID: {
        email: string,
        fullname: string,
        contactno: string,
        _id: string,
        picture: string,
    },
    price: number,
    _id: string,
    status: number,
}


export interface IRiderState {
    pendingBooking: IPendingBook
}

export const initialState: IRiderState = {
    pendingBooking: {
        origin: {
            place: '',
            latitude: 0,
            longitude: 0,
        },
        destination: {
            place: '',
            latitude: 0,
            longitude: 0,
        },
        distance: {
            text: '',
            value: 0
        },
        ratings: {
            rate: 4,
            rated: false
        },
        passengerID: {
            email: '',
            fullname: '',
            contactno: '',
            _id: '',
            picture: '',
        },
        price: 0,
        _id: '',
        status: 0,
    }
}

const RiderReducer = (state: IRiderState = initialState , action: ActionsType) => {
    switch(action.type){
        case Actions.setPendingBooking:
            state.pendingBooking = action.payload
            return {...state}
        case Actions.acceptPendingBooking:
            let pendingbookingstate = state.pendingBooking
            pendingbookingstate.status = 1
            return {...state, pendingBooking: {...pendingbookingstate}}
        default: 
            return state
    }
}

export default RiderReducer