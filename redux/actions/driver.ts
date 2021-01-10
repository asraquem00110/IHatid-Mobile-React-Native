import { Dispatch } from "react"
import types from "../../api/types"
import { apiwrapper } from "../../api/wrapper"
import { BookingSocketclient } from "../../helper/sockets"
import { RootState } from "../reducers"
import { IPendingBook } from "../reducers/driver"

export enum Actions {
    setPendingBooking = "DRIVER_SET_PENDING_BOOKIKNG",
    acceptPendingBooking = "DRIVER_ACCEPT_BOOKING",
}

export type ActionsType = 
| {type: Actions.setPendingBooking , payload: any}
| {type: Actions.acceptPendingBooking , payload: null}

class DriversAction {
    
    public setPendingBooking(data: any){
        return (dispatch: Dispatch<ActionsType> , getState: ()=> RootState) => {
            dispatch({
                type: Actions.setPendingBooking,
                payload: data
            })
        }
    }

    public acceptBooking(){
        return async (dispatch: Dispatch<ActionsType> , getState: ()=> RootState) => {
            let booking = getState().rider.pendingBooking
            let result = await apiwrapper.APICALL('api/mobile/rider/acceptBooking', booking , types.PATCH)
            if(result){
                dispatch({
                    type: Actions.acceptPendingBooking,
                    payload: null
                })
            }
        }
    }

    public checkIFtheresPending(){
        return async (dispatch: Dispatch<ActionsType> , getState: ()=> RootState) => {
            let booking = await apiwrapper.APICALL('api/mobile/rider/checkIftheresPending',null,types.POST)
            if(booking != null){
                dispatch({
                    type: Actions.setPendingBooking,
                    payload: booking
                })
            }

            return booking
            
        }
    }
}


let driversAction: DriversAction = new DriversAction()
export {driversAction,DriversAction}