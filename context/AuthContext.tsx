import React , {createContext, useReducer, useState} from 'react'
import {AuthReducer} from './reducers/AuthReducer'
import { LoginButton, AccessToken  , LoginManager} from 'react-native-fbsdk'
import { GraphRequest, GraphRequestManager } from 'react-native-fbsdk'
import {auth} from '../api/auth'
import {MobileLogin} from '../api/auth/MobileLogin'


export interface AuthState {
    usertype: number,
    islogin: boolean,
    mobilenumber: string,
    facebookLogin: ()=> void,
    mobileLogin: (mobilenumber: string)=> void,
    logout: ()=> void,
}

const defaulValue: AuthState = {
    usertype: 1,
    islogin: false,
    mobilenumber: '',
    facebookLogin: ()=> null,
    mobileLogin: ()=> null,
    logout: ()=> null,
}

export interface FBData {
    id: string,
    name: string,
    email?: string,
    picture: string,
    address: string,
    accesstoken: string,
}

export const AuthContext = createContext<AuthState>(defaulValue)

const AuthContextProvider: React.FC = (props) => {

    const [state,dispatch] = useReducer(AuthReducer, defaulValue)
    const [fbtoken,setFbToken] = useState<string>('')

     // LoginManager.logOut() // To Logout
    const facebookLogin = () => {
        LoginManager.logInWithPermissions(["public_profile","user_birthday","user_location","user_hometown"]).then(
            function(result: any) {
              if (result.isCancelled) {
                console.log("Login cancelled");
              } else {
                console.log(
                  "Login success with permissions: " +
                    result.grantedPermissions.toString()
                );
              }

              console.log(result)
              AccessToken.getCurrentAccessToken().then(
                (data: any) => {
                    console.log(data.accessToken.toString())
                    setFbToken(data.accessToken)
                }
              )
              new GraphRequestManager().addRequest(infoRequest).start()
            },
            function(error) {
              console.log("Login fail with error: " + error);
            }
          );
    }

    const _responseInfoCallback = (error: any, result: any) => {
        if (error) {
          console.log('Error fetching data: ' + error.toString());
        } else {
          console.log('Success fetching data: ' + result.toString());
        //   console.log(result)
          let fbdetails: FBData = {
            id: result.id,
            name: result.name,
            picture: result.picture.data.url,
            address: `${result.location.name} ${result.hometown.name}`,
            accesstoken: fbtoken
          }

          console.log(fbdetails)
        }
      }
    
      const infoRequest: GraphRequest = new GraphRequest(
        '/me',
        {
            httpMethod: 'GET',
            version: 'v2.5',
            parameters: {
                'fields': {
                    'string' : 'id,email,name,birthday,picture,location,hometown'
                }
            }
        },
        _responseInfoCallback,
      );

      const mobileLogin = async (mobilenumber: string)=>{
          let mobile = await auth.login({mobilenumber: mobilenumber},new MobileLogin())
         
      }

      const logout = ()=>{
        console.log("USER LOGOUT IN MOBILE CLEAR ALL DATA FROM STORAGE AND CHANGE STATE AUTHSTATE")
      }

    return (
        <>
            <AuthContext.Provider
                value={{
                    usertype: state.usertype,
                    islogin: state.islogin,
                    mobilenumber: state.mobilenumber,
                    facebookLogin: facebookLogin,
                    mobileLogin: mobileLogin,
                    logout: logout,
                }}
            >
                {props.children}
            </AuthContext.Provider>
        </>
    )
}

export default AuthContextProvider