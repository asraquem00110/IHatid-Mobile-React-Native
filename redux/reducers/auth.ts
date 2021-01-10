import {Actions,ActionsType} from '../actions/auth'
import localStorage from 'react-native-sync-localstorage'

export interface IUserState  {
    accessToken: string,
    refreshToken: string,
    isLogin: boolean,
    userinfo: {
        _id: string,
        fullname: string,
        contactno: string,
        address: string,
        picture: null | string,
        motorcyle: {
            motorcycle: string | null,
            description: string | null,
            plateno: string | null,
            registrationNo: string | null,
        }
    },
    usertype: number,
    status: number,
}

export const initialState: IUserState = {
    accessToken: '',
    refreshToken: '',
    isLogin: localStorage.getItem('isLogin') || false,
    userinfo: {
        _id: '',
        fullname: '',
        contactno: '',
        address: '',
        picture: null,
        motorcyle: {
            motorcycle: null,
            description: null,
            plateno: null,
            registrationNo: null
        }
    },
    usertype: localStorage.getItem('usertype') || 1,
    status: localStorage.getItem('userstatus') || 0,
}

const authReducer = (state: IUserState = initialState, action: ActionsType) =>{
    switch(action.type){
        case Actions.signIn:
            localStorage.setItem('isLogin', true)
            localStorage.setItem('usertype', action.payload.info.usertype)
            localStorage.setItem('userstatus', action.payload.info.status)
            localStorage.setItem('userinfo',action.payload.info)
            localStorage.setItem('accessToken', action.payload.accesstoken)
            localStorage.setItem('refreshToken',action.payload.refreshtoken)
            state.isLogin = true
            state.usertype = action.payload.info.usertype
            state.status = action.payload.info.status
            state.userinfo = action.payload.info
            state.accessToken = action.payload.accesstoken
            state.refreshToken = action.payload.refreshtoken
            return {...state}
        case Actions.signOut:
            localStorage.removeItem('isLogin')
            localStorage.removeItem('usertype')
            localStorage.removeItem('userstatus')
            localStorage.removeItem('userinfo')
            localStorage.removeItem('accessToken')
            localStorage.removeItem('refreshToken')
            state.accessToken = ''
            state.refreshToken = ''
            state.isLogin = false
            state.userinfo = initialState.userinfo
            return {...state}
        case Actions.refreshToken:
            localStorage.setItem('accessToken', action.payload.accessToken)
            localStorage.setItem('refreshToken',action.payload.refreshToken)
            state.accessToken = action.payload.accessToken
            state.refreshToken = action.payload.refreshToken
            return {...state}
        case Actions.initializeInfo:
            localStorage.setItem('userinfo.fullname',action.payload.fullname)
            localStorage.setItem('userinfo.address',action.payload.address)
            localStorage.setItem('userstatus', 1)
            state.userinfo.fullname = action.payload.fullname
            state.userinfo.address = action.payload.address
            state.status = 1
            return {...state}
        case Actions.BecomeARider:
            localStorage.setItem('usertype', 2)
            localStorage.setItem('userinfo.motorcyle', action.payload)
            state.usertype = 2
            state.userinfo.motorcyle = action.payload
            return {...state}
        default: 
            return state
    }
}

export default authReducer

