import React, {Suspense , lazy } from 'react';
import {Text,View,StatusBar} from 'react-native';
import ConnectivityContextProvider from './context/ConnectivityContext'
import ThemeContextProvider from './context/ThemeContext'
import AuthContextProvider from './context/AuthContext'
import WebSocketContextProvider from './context/WebSocketContext'
import { Provider } from 'react-redux'
import {store} from './redux/store'
import localStorage from 'react-native-sync-localstorage'

interface StorageInterface {
  Theme?: boolean,
  isLogin?: boolean,
  userstatus?: number,
  usertype?: number,
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
  accessToken?: string,
  refreshToken?: string
}

const Main = lazy(()=>import('./Main'))

console.log(store.getState().auth)
// initialize storage to states reducers
localStorage.getAllFromLocalStorage()
    .then((data: StorageInterface) => {
        if(data.isLogin) store.getState().auth.isLogin = data.isLogin
        if(data.userstatus) store.getState().auth.status = data.userstatus
        if(data.usertype) store.getState().auth.usertype = data.usertype
        if(data.userinfo) store.getState().auth.userinfo = data.userinfo
        if(data.accessToken) store.getState().auth.accessToken = data.accessToken
        if(data.refreshToken) store.getState().auth.refreshToken = data.refreshToken
   
    })
    .catch((err: any) => {
    console.warn(err)
})

const App = () => {
  
  return (
    <>
    <StatusBar barStyle="dark-content" />
    <Provider store={store}>
      <Suspense fallback={<View><Text>Loading</Text></View>}>
          <ConnectivityContextProvider>
            <ThemeContextProvider>
                <AuthContextProvider>
                  <WebSocketContextProvider>
                        <Main></Main>
                  </WebSocketContextProvider>
              </AuthContextProvider>
            </ThemeContextProvider>
        </ConnectivityContextProvider>
      </Suspense>
    </Provider>
    </>
  );
};

export default App;
