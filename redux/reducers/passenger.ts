import { ActionsType } from "../actions/passenger"

export interface IPassengerState {

}

export const initialState: IPassengerState = {

}

const PassengerReducer = (state: IPassengerState = initialState, action: ActionsType) => {
    switch(action.type){

        default: 
            return state
    }
}

export default PassengerReducer
