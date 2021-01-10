import React, { createContext, useState , useCallback } from 'react'
import ConnectivityManager from 'react-native-connectivity-status'
import NetInfo , {NetInfoState , useNetInfo}  from "@react-native-community/netinfo"
import Geolocation, { getCurrentPosition } from 'react-native-geolocation-service'
import { useDispatch } from 'react-redux'


interface mylocation {latitude: number | null, longitude: number | null}

export interface ConnectivityState {
    NetConnection: boolean | undefined | null,
    LocationService: boolean | undefined | null,
    checkInternet: ()=> void,
    checkLocationService: ()=> void,
    turnonLocation: ()=> void,
    subscribeInternetChecking: ()=> void,
    mylocation: mylocation
    getCurrentPosition: ()=> void,
}

const defaultValue: ConnectivityState = {
    NetConnection: null,
    LocationService: null,
    checkInternet: ()=> null,
    checkLocationService: ()=> null,
    turnonLocation: ()=> null,
    subscribeInternetChecking: ()=> null,
    mylocation: {latitude: null ,longitude: null},
    getCurrentPosition: ()=> null
}

export const ConnectivityContext = createContext<ConnectivityState>(defaultValue)

const ConnectivityContextProvider: React.FC = (props) => {

    const [NetConnection,setNetConnection] = useState<boolean | undefined | null>(defaultValue.NetConnection)
    const [LocationService,setLocationService] = useState<boolean | undefined | null>(defaultValue.LocationService)
    const [myLocation, setMyLocation] = useState<mylocation>(defaultValue.mylocation)
    const dispatch = useDispatch()


    const checkInternet = (): void => {
        NetInfo.fetch().then(state => {
         setNetConnection(state.isInternetReachable)
        });
    }

      // put in a global context
    const subscribe = NetInfo.addEventListener((state: any) => {
        if(state.isInternetReachable) {
            console.log("INTERNET BACK")
        }else{
            console.log("CANT REACH INTERNET")
        }
        // setNetConnection(state.isInternetReachable)
        checkInternet()
    });

    const checkLocationService = async () => {
        const locationServicesAvailable = await ConnectivityManager.areLocationServicesEnabled()
        setLocationService(locationServicesAvailable)
      }
    
    

    const connectivityStatusSubscription = ConnectivityManager.addStatusListener((data: any) => {
        switch (data.eventType) {
            case 'bluetooth':
                        console.log(`Bluetooth is ${data.status ? 'ON' : 'OFF'}`)
                    break
            case 'location':
                        console.log(`Location Services are ${data.status ? 'AVAILABLE' : 'NOT available'}`)
                        setLocationService(data.status)
                    break
        }
    })
    
    // Remember to unsubscribe from connectivity status events
   // connectivityStatusSubscription.remove()

    const getCurrentPosition = () => {
        Geolocation.getCurrentPosition(
            (position: any) => {
                setMyLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                })
            },
            (error) => {
            // See error code charts below.
            console.log(error.code, error.message);
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
    }

    const turnonLocation = () => {
       // if(!LocationService) {
            getCurrentPosition()
      //  }
    }

    return (
        <>
            <ConnectivityContext.Provider
                value={{
                    NetConnection: NetConnection,
                    LocationService: LocationService,
                    checkInternet: checkInternet,
                    subscribeInternetChecking: subscribe,
                    checkLocationService: checkLocationService,
                    turnonLocation: turnonLocation,
                    mylocation: myLocation,
                    getCurrentPosition: getCurrentPosition,
                }}
            >
                {props.children}
            </ConnectivityContext.Provider>
        </>
    )
}

export default ConnectivityContextProvider