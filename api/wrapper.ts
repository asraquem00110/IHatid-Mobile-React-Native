import axios from 'axios'
import {store} from '../redux/store'
import {Actions} from '../redux/actions/auth'
import config from '../helper/config'

class APIWrapper {
    private baseurl: string = config.BACKEND_URL // url of backend server
   
    constructor(){
      
    }

    public APILOGIN = (url: string ,data: object): Promise<Object>=>{
        const apiUrl = `${this.baseurl}/${url}`

        console.log(apiUrl)

        return new Promise((res,rej)=>{
            axios.post(apiUrl, data)
                .then((response)=>{
                    console.log(response.data)
                    res(response)
                })
                .catch(err=>rej(err))
        })
    }

    public APICALL =(url: string ,data: object | null, type: string): Promise<object>=>{  
        axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'
        axios.defaults.headers.common["Accept"] = 'application/json'
        axios.defaults.headers.common["Authorization"] = `Bearer ${store.getState().auth.accessToken}`

        const apiUrl = `${this.baseurl}/${url}`
    
        return new Promise((res,rej)=>{
            switch(type){
                case "POST":
                    axios.post(`${apiUrl}`, data).then(response=>res(response.data)).catch(err=>{ this.RedirectIfUnauthenticated(err);rej(err);})
                    break
                case "GET":
                    axios.get(`${apiUrl}`).then(response=>res(response.data)).catch(err=>{ this.RedirectIfUnauthenticated(err);rej(err);})
                    break
                case "DELETE":
                    axios.delete(`${apiUrl}`).then(response=>res(response.data)).catch(err=>{ this.RedirectIfUnauthenticated(err);rej(err);})
                    break
                case "PATCH":
                    axios.patch(`${apiUrl}`, data).then(response=>res(response.data)).catch(err=>{ this.RedirectIfUnauthenticated(err);rej(err);})
                    break
                default: 
                    break
            }
        })
    }

    private RedirectIfUnauthenticated(e: any){
        if(e.response.status === 401) {
              // attempt to refreshtoken 
            const apiurl = `${this.baseurl}/api/auth/refreshtoken`
            axios.post(apiurl,{refreshtoken: 'refreshtoken here'}).then((response: any)=>{
                console.log(response)
                // save new token to authcontext
                store.dispatch({type: Actions.refreshToken , payload: {accessToken: response.data.accessToken , refreshToken: response.data.refreshToken}})
              
            }).catch((err)=>{
                if(err.response.status === 401 || err.response.status === 403 ) {
                    store.dispatch({type: Actions.signOut , payload: null})
                }
            })
        }
    }

}

let apiwrapper: APIWrapper = new APIWrapper()
export {apiwrapper,APIWrapper}