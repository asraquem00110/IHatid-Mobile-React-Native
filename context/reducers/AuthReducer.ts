import {AuthState} from '../AuthContext'


export enum ActionInitialize {
    login = "LOGIN",
    logout = "LOGOUT"
}


type Actions = 
| {type: ActionInitialize.login , payload: any }
| {type: ActionInitialize.logout , payload: any}

export const AuthReducer = (state: AuthState , action: Actions): AuthState => {

    switch(action.type){
        case ActionInitialize.login:
            return state
        case ActionInitialize.logout:
            return state
        default:
            return state
    }
}