import types from "../../api/types"
import { apiwrapper } from "../../api/wrapper"
import { ThunkAction } from 'redux-thunk'
import { RootState } from "../reducers"
import { Action } from 'redux'
import { Dispatch } from "react"

export enum Actions {
    setPickupAt = "BOOKINGS_SET_PICKUP",
    setDropoff = "BOOKINGS_SET_DROPOFF",
    setOtherInfo = "BOOKINGS_SET_OTHERINFO",
    setActiveBook = "BOOKINGS_SET_ACTIVE_BOOK",
    cancelBooking = "BOOKINGS_CANCEL",
    setDriverInfo = "BOOKINGS_SET_DRIVERINFO",
} 

export type ActionsType = 
| {type: Actions.setPickupAt, payload: {name: string, lat: number, lng: number}}
| {type: Actions.setDropoff, payload: {name: string, lat: number, lng: number}}
| {type: Actions.setOtherInfo , payload: {
    destination: {
        text: string,
        value: number,
    },
    traveltime: string,
    price: number,
}}
| {type: Actions.setActiveBook, payload: { details: any}}
| {type: Actions.cancelBooking , payload: any}
| {type: Actions.setDriverInfo, payload: any}

interface PlaceInfo {
    adr_address: string,
    geometry: {
        location: {
            lat: number,
            lng: number,
        }
    },
    name: string,
    place_id: string
}


class BookingsAction {


    public setPickupAt(info: PlaceInfo){
        return (dispatch: Dispatch<ActionsType>, getState: ()=> RootState) => {
            dispatch({
                type: Actions.setPickupAt,
                payload: {
                    name: info.name,
                    lat: info.geometry.location.lat,
                    lng: info.geometry.location.lng,
                }
            })
        }
    }

    public setDropoff(info: PlaceInfo){
        return (dispatch: Dispatch<ActionsType>, getState: ()=> RootState) => {
            dispatch({
                type: Actions.setDropoff,
                payload: {
                    name: info.name,
                    lat: info.geometry.location.lat,
                    lng: info.geometry.location.lng,
                }
            })
        }
    }

    public setOthersInfo(destination: { text: string, value: number} , traveltime: string){
        return (dispatch:  Dispatch<ActionsType>, getState: ()=> RootState) => {
            let price = Math.floor(destination.value * 0.025)
            dispatch({
                type: Actions.setOtherInfo,
                payload: {
                    destination: {
                        text: destination.text,
                        value:  destination.value,
                    },
                    traveltime: traveltime,
                    price: price,
                }
            })
        }
    }

    public checkIFtheresPending(){
        return async (dispatch:  Dispatch<ActionsType>, getState: ()=> RootState) => {
            let data = await apiwrapper.APICALL('api/mobile/passenger/checkIftheresPending', null , types.POST)
            if(data){
                dispatch({
                    type: Actions.setActiveBook,
                    payload: {
                        details: data
                    }
                })
            }
            return data
        }
    }

    public createBooking(): ThunkAction<void, RootState, unknown, Action<string>>{
        return async (dispatch: Dispatch<ActionsType>, getState: ()=> RootState) => {
 
            let origin = getState().bookings.pickup
            let destination = getState().bookings.dropoff
            let distance = getState().bookings.distance
            let price = getState().bookings.price
        
            let responseSave: any = await apiwrapper.APICALL('api/mobile/passenger/createBooking', {
                origin: origin,
                destination: destination,
                distance: distance,
                price: price,
            } , types.POST)

            if(responseSave){
                dispatch({
                    type: Actions.setActiveBook,
                    payload: {
                        details: responseSave
                    }
                })
                return responseSave
            }
            
        }
    }

    public cancelBooking(){
        return async (dispatch: Dispatch<ActionsType>, getState: ()=> RootState) => {
            let removeBook = await apiwrapper.APICALL(`api/mobile/passenger/cancelBooking/${getState().bookings.Booking.id}`, null , types.PATCH)
            if(removeBook){
                dispatch({
                    type: Actions.cancelBooking,
                    payload: null
                })
            }
        }
    }

    public findDriver(bookID: string, pickup: [number, number], dropoff: [number,number]){
        return async (dispatch: Dispatch<ActionsType>, getState: ()=> RootState) => {
            let response: any = await apiwrapper.APICALL(`api/mobile/passenger/findDriver` , {bookID: bookID, pickup: pickup, dropoff: dropoff}, types.POST)
            return response
        }
    }

    public setDriverInfo(data: any){
        return (dispatch: Dispatch<ActionsType>, getState: ()=> RootState) => {
            dispatch({
                type: Actions.setDriverInfo,
                payload: data
            })
        }
    }

    public async getDriverLastLocation(driverID: string){
        let getDriverLocation = await apiwrapper.APICALL(`api/mobile/rider/getLastLocation/${driverID}`, null, types.GET)
        return getDriverLocation
    }
    
}

let bookingsAction: BookingsAction = new BookingsAction()
export {bookingsAction,BookingsAction}