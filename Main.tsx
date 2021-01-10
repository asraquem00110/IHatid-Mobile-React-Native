import React , {useContext,useEffect, useState , lazy} from 'react'
import {PermissionsAndroid} from 'react-native'
import {ConnectivityContext,ConnectivityState} from './context/ConnectivityContext'
import {useSelector} from 'react-redux'
import {RootState} from './redux/reducers/index'

const FlashScreen = lazy(()=>import('./components/FlashScreen'))
const PassengerMainComponent = lazy(()=>import('./components/Passenger/PassengerMainComponent'))
const RiderMainComponent = lazy(()=> import('./components/Rider/RiderMainComponent'))
const LoginComponent = lazy(()=>import('./components/LoginComponent'))
const WelcomeComponent= lazy(()=>import('./components/WelcomeComponent'))



const Main: React.FC = () =>{
    const [isLoading,setIsLoading] = useState<boolean>(true)
    const {NetConnection,LocationService,checkInternet,checkLocationService , turnonLocation , subscribeInternetChecking} = useContext<ConnectivityState>(ConnectivityContext)
    const auth = useSelector((state: RootState)=> state.auth)

    
    const checkLocationPermission = async (): Promise<boolean> =>{
      return await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
    }

    const requestLocationPermission = async()=>{
      try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: "IHatid App Location Permission",
              message:
                "IHatid App needs access to your Location " +
                "so you can take realtime data.",
              buttonNeutral: "Ask Me Later",
              buttonNegative: "Cancel",
              buttonPositive: "OK"
            }
          );
          console.log(granted)
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log("You can use the location");
            turnonLocation()
          } else {
            console.log("Location permission denied");
          }
        } catch (err) {
          console.warn(err);
        }
    }

    
    // subscribeInternetChecking()
    useEffect(()=>{
        checkInternet()
        checkLocationPermission().then((res)=>{
            res ? checkLocationService() : requestLocationPermission() 
        })
        setTimeout(()=>{
             if(NetConnection && LocationService) setIsLoading(false)
        },2000)
    },[NetConnection,LocationService])

    return (
        <>
            {
                isLoading
                ? <FlashScreen permission={LocationService} isConnected={NetConnection} checkInternet={checkInternet} turnonLocation={turnonLocation}/>
                : auth.isLogin 
                  ? auth.status == 1
                    ? auth.usertype == 1 
                      ? <PassengerMainComponent/>
                      : <RiderMainComponent/>
                    : <WelcomeComponent/>
                  : <LoginComponent/>
            }
        </>
    )
}

export default Main