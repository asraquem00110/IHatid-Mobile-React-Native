
import {apiwrapper} from '../../api/wrapper'
import types from '../../api/types'
import IOauth from './oauth/IOauth.interface'
import { RootState } from '../reducers'
import { Dispatch } from 'react'

export enum Actions {
    checkifFBExist = "OAUTH_FB_CHECKIF_EXIST",
    FBsignOut = "OAUTH_FB_SIGNOUT",
}

export type ActionsType = 
| {type: Actions.checkifFBExist, payload: any}
| {type: Actions.FBsignOut, payload: any}


class OauthActions {

    public oauthlogin(oauth: IOauth){
        return (dispatch: Dispatch<ActionsType>,getState: ()=> RootState) => {
            return oauth.authenticate()
        }
    }

    public register(oauth: IOauth, pin: string, mobileno: string){
        return (dispatch: Dispatch<ActionsType>,getState: ()=> RootState) => {
            return oauth.register(pin, mobileno)
        }
    }

    public addVerificationPin(mobileno: string){
        return async (dispatch: Dispatch<ActionsType>,getState: ()=> RootState) => {
            let result = await apiwrapper.APICALL('api/mobile/oauth/addVerificationPincode',{mobilenumber: mobileno}, types.POST)
            return result
        }
    }
}

let oauthActions: OauthActions = new OauthActions()
export {oauthActions, OauthActions}