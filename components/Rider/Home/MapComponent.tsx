import { useFocusEffect } from '@react-navigation/native'
import React, { lazy, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { Alert, Dimensions, StyleSheet , View , Modal , TouchableHighlight ,Text , TextInput , Image} from 'react-native'
import Mapview,{PROVIDER_GOOGLE,Marker,Callout,Polyline} from 'react-native-maps'
import { ConnectivityContext, ConnectivityState } from '../../../context/ConnectivityContext'
import NoInternet from '../../NoInternet'
import Geolocation from 'react-native-geolocation-service'
import {useSelector , useDispatch} from 'react-redux'
import { RootState } from '../../../redux/reducers'
import { driversAction } from '../../../redux/actions/driver'
import RequestBooking from './requestBook'
import { LocationContext, LocationContextState } from '../../../context/sockets/LocationContext'
import { BookingContext, BookingContextState } from '../../../context/sockets/BookingContext'

const {width,height} = Dimensions.get('window')
const LocationServiceOff = lazy(()=> import('../../LocationServiceOff'))
const DriverInfo = lazy(()=>import('./DriverInfo'))
const DriverOnTheWay = lazy(()=>import('./DriverOnTheWay'))
const PinPoints = lazy(()=>import('./PinPoints'))

const MapComponent: React.FC = (): JSX.Element => {
    const dispatch = useDispatch()
    const PendingBook = useSelector((state: RootState)=>state.rider.pendingBooking)
    const driverAuth = useSelector((state: RootState)=> state.auth.userinfo)
    const {NetConnection, mylocation , getCurrentPosition , LocationService , turnonLocation} = useContext<ConnectivityState>(ConnectivityContext)
    const [myposition, setMyPosition] = useState<{latitude: number, longitude: number} | null>(null)
    const [mounted,setMounted] = useState<boolean>(true)
    const [loading,setLoading] = useState(true)
    const {driverjoinOnline, requestModal , closeRequestModal} = useContext<LocationContextState>(LocationContext)
    const {sendDriverLocation, joinBookingRoom}  = useContext<BookingContextState>(BookingContext)
    const [renderDetails,setRenderDetails] = useState<JSX.Element>(<></>)
    const [watchIDState,setWatchIDState] = useState<number | null>(null)
    const [enableAccuracy, setEnableAccuracy] = useState<boolean>(true)


    const region = {
        latitude: mylocation.latitude || 14.5151763,
        longitude: mylocation.longitude || 121.0439442,
        latitudeDelta: 0.005699662594501831,
        longitudeDelta:  0.003234408795819377,
    }

    const mymapref:  React.MutableRefObject<any> = useRef(null)

    const AnimateRegion = (latitude: number, longitude: number): void => {
        if(mymapref.current != null){
            mymapref.current.animateToRegion({
                ...region,
                latitude: latitude,
                longitude: longitude,
            })
    
        }

    }

    const success = (position: any)=>{
        // console.log(position)

        setMyPosition({ latitude: position.coords.latitude, longitude: position.coords.longitude})
        AnimateRegion(position.coords.latitude, position.coords.longitude)
        driverjoinOnline(driverAuth._id , position.coords.latitude , position.coords.longitude)
        console.log('driver join nearby')

        if(PendingBook.status == 1){
            console.log('sending driver location')
            sendDriverLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude}, PendingBook._id , PendingBook.origin)
        }
      

    }
    const error = (e: any) => {
        console.log('Error Code: ' + e.code + ' Error Message: ' + e.message)
        // Alert.alert('Error Code: ' + e.code + ' Error Message: ' + e.message)
        if(watchIDState){
            Geolocation.clearWatch(watchIDState)
            setWatchIDState(null)
            Geolocation.stopObserving()
        }

        setEnableAccuracy(false)
        getPositionLocation()
    }

    
    const checkIFtheresPending = async ()=>{
        try {
            let booking: any = await  dispatch(driversAction.checkIFtheresPending())
            if(booking != null)  joinBookingRoom( `Book_${booking._id}`, booking._id, "driver")
        }catch(err){
            console.log(err)
        }
    }

    const initializeWatchPosition = ()=> {
        const watchId = Geolocation.watchPosition(success,error,{
            enableHighAccuracy: enableAccuracy,
            interval: 10000, // default value is 10000 or 10s
           // distanceFilter: 20// meters
            })

         setWatchIDState(watchId)
    }

    const getPositionLocation = (): void => {
        Geolocation.getCurrentPosition((position: any)=>{
            success(position)
            initializeWatchPosition()
        },error,{
            enableHighAccuracy: enableAccuracy,
            timeout: 20000,
            maximumAge: 60 * 60 * 24,
            // distanceFilter: 20 // meters
        })
    }

    useFocusEffect(useCallback(()=>{
        checkIFtheresPending()
        getPositionLocation()
        return ()=>{
            console.log("Lost focus in screen")
            Geolocation.clearWatch(0)
            if(watchIDState){
                Geolocation.clearWatch(watchIDState)
                setWatchIDState(null)
            }
            Geolocation.stopObserving()
           
        } 
    },[]))
    // },[mymapref]))

    useEffect(()=>{
        if(mounted){
            setLoading(false)
        }
       
        return () => {
            setMounted(false)
        }
    },[])

    useEffect(()=>{
        setRenderDetails(renderFunction())
    },[PendingBook.status])


    const renderFunction = (): JSX.Element => {
        switch(PendingBook.status){
            case 1:
                return <DriverOnTheWay PendingBook={PendingBook}/>
            default:    
                return <></>
        }
    }

    const onRegionChangeComplete = (e: any)=> {
     console.log(e)
    }


    return (
        <>
        {
            loading
            ? <></>
            : <>
                <View style={styles.container}>
                    <View style={styles.mapcontainer}>
                        <Mapview
                                provider={PROVIDER_GOOGLE}
                                showsUserLocation={false}
                                initialRegion={region}
                                style={styles.map}
                                // loadingEnabled={true}
                                rotateEnabled={false}
                                showsPointsOfInterest={false}
                                ref={mymapref}
                                showsMyLocationButton={true}
                                // onMapReady={fitToMap}
                                onRegionChangeComplete={onRegionChangeComplete}
                                // onMapReady={onMapReady}
                            >

                                { 
                                    myposition
                                    ? <Marker
                                        coordinate={myposition}
                                        image={require('../../../assets/img/motor2.png')}
                                    >

                                        {/* <Image style={{height: 150 ,width: 150}} source={require('../../../assets/img/motor.png')}/> */}

                                    </Marker> 
                                    : null
                                }

                                <PinPoints mymapref={mymapref} myposition={myposition} PendingBook={PendingBook}/>
                           
                        </Mapview>
                        <DriverInfo />
                       
                        
                    </View>
       

                    {
                        NetConnection 
                        ?  renderDetails
                        : <NoInternet/>
                    }

                    {
                        !LocationService
                        ? <LocationServiceOff/>
                        : null
                    }
            </View>

            <RequestBooking  requestModal={requestModal} setRequestModal={(val)=>closeRequestModal()} myposition={myposition}/>
            </>
        }
            
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        ...StyleSheet.absoluteFillObject,
    },
    mapcontainer: {
        flexGrow: 1,
        position: 'relative',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    otherdetails: {
        flexBasis: height * 0.25,
    },
})


export default MapComponent