import {IAuth} from '../interfaces/IAuth'
import {apiwrapper} from '../wrapper'

export class MobileLogin implements IAuth {
   
    public login(data: {mobileno: string}){
       return apiwrapper.APILOGIN('api/mobile/mobilelogin',data)
    }
}