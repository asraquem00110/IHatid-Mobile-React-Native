import { Dispatch } from "react"
import types from "../../api/types"
import { apiwrapper } from "../../api/wrapper"
import { RootState } from "../reducers"
export enum Actions {
    BecomeARider = "PASSENGER_BECOME_A_RIDER",
}

export type ActionsType = 
| {type: Actions.BecomeARider, payload: null}


class PassengerActions {
   
}

let passengerActions: PassengerActions = new PassengerActions()
export {passengerActions, PassengerActions}