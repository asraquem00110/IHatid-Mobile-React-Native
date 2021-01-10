import {IAuth} from './interfaces/IAuth'
import {apiwrapper} from './wrapper'
import types from './types'

class Auth {

    public login(data: any , iauth: IAuth){
        return iauth.login(data)
    }
}

let auth: Auth = new Auth()
export {auth,Auth}