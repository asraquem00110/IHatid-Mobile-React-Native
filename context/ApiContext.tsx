import React , {createContext , useContext} from 'react'
import {AuthState,AuthContext} from './AuthContext'

export interface ApiState {
    apicall: ()=> Promise<any>,
    apilogin: ()=> Promise<any>,
    apilogout: ()=> void,
}

const defaultValue: ApiState = {
    apicall: ()=> new Promise((res,rej)=> res(null)),
    apilogin: ()=> new Promise((res,rej)=> res(null)),
    apilogout: ()=> null,
}

export const ApiContext = createContext<ApiState>(defaultValue)

const ApiContextProvider: React.FC = (props)=> {

    const authContext = useContext<AuthState>(AuthContext)

    const apicall = (): Promise<any> =>{
        return new Promise(async (res,rej)=>{
            try {
                res(1)
            }catch(err) {
                if(err.response.status === 401) // authcontext logout
                rej(err)
            }
        })
    }

    const apilogin = (): Promise<any> =>{
        return new Promise((res,rej)=>{
            try {
                res(1)
            }catch(err) {
                rej(err)
            }
        })
    }

    const apilogout = ()=>{

    }

    return (
        <>
            <ApiContext.Provider
                value={{
                    apicall: apicall,
                    apilogin: apilogin,
                    apilogout: apilogout ,
                }}
            >
                {props.children}
            </ApiContext.Provider>
        </>
    )
}

export default ApiContextProvider