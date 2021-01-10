
import {FBData} from '../actions/oauth/Facebook'
import {Actions} from '../actions/oauth'

export interface OAuthState {
    fbdetails: FBData,
    fbexist: boolean,
}

export const initialState: OAuthState = {
    fbdetails: {
        id: '',
        name: '',
        email: '',
        picture: '',
        address: '',
        accesstoken: '',
    },
    fbexist: true,
}

const oauthReducer = (state: OAuthState = initialState, action: any) =>{
    switch(action.type){
        case Actions.checkifFBExist:
            state.fbdetails = action.payload.fbdetails
            state.fbexist = action.payload.fbexist
            return {...state}
        case Actions.FBsignOut:
            state.fbdetails = initialState.fbdetails
            state.fbexist = initialState.fbexist
            return {...state}
        default: 
            return state
    }
}

export default oauthReducer

