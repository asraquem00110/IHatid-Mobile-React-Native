import IOauth from './IOauth.interface'
import { AccessToken  , LoginManager} from 'react-native-fbsdk'
import { GraphRequest, GraphRequestManager } from 'react-native-fbsdk'
import {store} from '../../store'
import {apiwrapper} from '../../../api/wrapper'
import types from '../../../api/types'
import {Actions} from '../../actions/oauth'
import {Actions as authActions} from '../../actions/auth'

export interface FBData {
    id: string,
    name: string,
    email?: string,
    picture: string,
    address: string,
    accesstoken: string,
    birthday?: string,
}


export class Facebook implements IOauth {

    public infoRequest: GraphRequest = new GraphRequest(
        '/me',
        {
            httpMethod: 'GET',
            version: 'v2.5',
            parameters: {
                'fields': {
                    'string' : 'id,email,name,birthday,picture.width(500).height(500),location,hometown'
                }
            }
        },
        this._responseInfoCallback,
      );
    
    public authenticate(){
        let app = this
        LoginManager.logOut()
        LoginManager.logInWithPermissions(["public_profile","user_birthday","user_location","user_hometown","email"]).then(
            function(result: any) {
              if (result.isCancelled) {
                console.log("Login cancelled");
              } else {
                // console.log(
                //   "Login success with permissions: " +
                //     result.grantedPermissions.toString()
                // );
                console.log("Login success")
              }
             new GraphRequestManager().addRequest(app.infoRequest).start()
            },
            function(error) {
              console.log("Login fail with error: " + error);
            }
          );
    }


    public async _responseInfoCallback(error: any, result: any): Promise<any>{

        // store.dispatch({type: Actions.signIn, payload: {test: 'test'}})

        if (error) {
            console.log('Error fetching data: ' + error.toString());
        } else {
            // console.log('Success fetching data: ' + result.toString());
            let currentAuth: any = await AccessToken.getCurrentAccessToken()

            let location: string = result.location ? result.location.name : ''
            let hometown: string = result.hometown ? result.hometown.name : ''
            let picture: string = result.picture ? result.picture.data.url : ''
            let birthday: string = result.birthday ? result.birthday : ''
            let email: string = result.email ? result.email : ''

            let fbdetails: FBData = {
                id: result.id,
                name: result.name,
                picture: picture,
                address: `${location} ${hometown}`,
                accesstoken: currentAuth.accessToken,
                email: email,
                birthday: birthday
            }
            let info: any = await apiwrapper.APICALL('api/mobile/checkifFBExist', {fbdetails: fbdetails} , types.POST)
            let exist = info ? true : false

            if(exist){
              store.dispatch({type: authActions.signIn, payload: {
                  info: info.info,
                  accesstoken: info.accesstoken,
                  refreshtoken: info.refreshtoken
              }})
            }else{
              store.dispatch({type: Actions.checkifFBExist, payload: {fbdetails:fbdetails , fbexist: exist}})
            }

         }
       
    }

    public async register(pin: string , mobileno: string){
      let response: any = await apiwrapper.APICALL('api/mobile/oauth/facebookOauth', {pin: pin, mobileno: mobileno, fbdetails: store.getState().oauth.fbdetails} , types.POST)
      if(response.verified){
        store.dispatch({type: authActions.signIn, payload: {
            info: response.info,
            accesstoken: response.accesstoken,
            refreshtoken: response.refreshtoken
        }})
      }
      return response
    }
    
}