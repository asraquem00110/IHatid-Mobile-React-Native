import IOauth from './oauth/IOauth.interface'
import {apiwrapper} from '../../api/wrapper'
import types from '../../api/types'
import {Actions as oauthActions , ActionsType as oauthActionsType} from './oauth'
import { Dispatch } from 'react'
import { RootState } from '../reducers'
import { IMotorcyle } from '../../components/Passenger/BeaRider'
import { BookingSocketclient, LocationsSocketclient ,ChatSocketclient } from '../../helper/sockets'


export enum Actions {
    signIn = "AUTH_USER_SIGNIN",
    signOut = "AUTH_USER_SIGNOUT",
    refreshToken = "AUTH_USER_REFRESHTOKEN",
    initializeInfo = "AUTH_USER_INITIALIZE_INFO",
    BecomeARider = "AUTH_BECOME_A_RIDER",
}

export type ActionsType = 
 | {type: Actions.signIn, payload: any}
 | {type: Actions.signOut, payload: any}
 | {type: Actions.refreshToken, payload: any}
 | {type: Actions.initializeInfo, payload: any}
 | {type: Actions.BecomeARider, payload: any}


 class AuthActions {

    public mobilelogin(number: string){
        return async (dispatch:  Dispatch<ActionsType>,getState: ()=> RootState): Promise<any> => {
            let response = await apiwrapper.APILOGIN('api/mobile/mobilelogin',{mobilenumber: number})
            return response
        }
    }

    public initializeInfo(fullname: string, address: string){
        return async (dispatch: Dispatch<ActionsType>, getState: ()=> RootState): Promise<any> => {
            let response = await apiwrapper.APICALL('api/mobile/auth/initializeInfo', {fullname: fullname, address: address}, types.POST)
            if(response){
                dispatch({
                    type: Actions.initializeInfo,
                    payload: {
                        fullname: fullname,
                        address: address
                    }
                })
            }
        }
    }

    public requestNewPin(number: string){
        return async (dispatch: Dispatch<ActionsType>,getState: ()=> RootState): Promise<any> => {
            let response = await apiwrapper.APICALL('api/mobile/requestNewPin', {mobilenumber: number} , types.POST)
            return response
        }
    }

    public verifyPin(pincode: string, mobileno: string){
        return async (dispatch: Dispatch<ActionsType>,getState: ()=> RootState): Promise<any> => {
            let response: any = await apiwrapper.APICALL('api/mobile/verifyPin', {pin: pincode, mobileno: mobileno} , types.POST)
            if(response.pincodecheck) dispatch({
                type: Actions.signIn,
                payload: {
                    info: response.info,
                    accesstoken: response.accesstoken,
                    refreshtoken: response.refreshtoken
                }
            })
            return response.pincodecheck
        }
    }

    public oauthlogin(oauth: IOauth){
        return (dispatch: Dispatch<ActionsType>,getState: ()=> RootState) => {
            return oauth.authenticate()
        }
    }

    public signOut(){
        return (dispatch: Dispatch<ActionsType | oauthActionsType>,getState: ()=> RootState) => {
            dispatch({
                type: oauthActions.FBsignOut,
                payload: {}
            })
            dispatch({
                type: Actions.signOut,
                payload: null,
            })
        }
    }

    public beARider(motorcyleInfo: IMotorcyle){
        return async (dispatch: Dispatch<ActionsType>,getState: ()=> RootState) => {
           let response: any = await apiwrapper.APICALL('api/mobile/passenger/becomeARider', motorcyleInfo , types.PATCH)
           if(response) {
               if(!response.errors) dispatch({
                     type: Actions.BecomeARider,
                    payload: motorcyleInfo
                })  
           }
           return response
        }
    }
 }

 let authActions: AuthActions = new AuthActions()
 export {authActions,AuthActions}
