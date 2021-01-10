import React , {useRef,useState , useContext, useEffect , useCallback, lazy} from 'react'
import {ConnectivityContext,ConnectivityState} from '../../../context/ConnectivityContext'
import {StyleSheet,View, Image , Text , Dimensions, Alert} from 'react-native'
import Mapview,{PROVIDER_GOOGLE,Marker,Callout,Polyline} from 'react-native-maps'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../redux/reducers'
import { useFocusEffect } from '@react-navigation/native'
import { bookingsAction } from '../../../redux/actions/bookings'
import axios from 'axios'
import config  from '../../../helper/config'
import mappolyline from '@mapbox/polyline'
import { LocationContext, LocationContextState } from '../../../context/sockets/LocationContext'
import { BookingContext, BookingContextState } from '../../../context/sockets/BookingContext'


const { width, height } = Dimensions.get('window')
const WaitingForDrivertoAccept = lazy(()=>import('./WatingForDriver'))
const DriverOnTheWay = lazy(()=>import('./DriverOnTheWay'))
const MapHeaders = lazy(()=>import('./MapHeaders'))
const BookDetails = lazy(()=>import('./BookDetails'))
const NoInternet = lazy(()=>import('../../NoInternet'))
const PinPoints = lazy(()=>import('./PinPoints'))

const MapComponent: React.FC = (): JSX.Element => {

    let mymapref: any = useRef({})
    const [watchID,setWatchID] = useState<null | number>(null)
    const {NetConnection, mylocation , getCurrentPosition} = useContext<ConnectivityState>(ConnectivityContext)
    const bookings = useSelector((state: RootState)=> state.bookings)
    const [renderDetails,setRenderDetails] = useState<JSX.Element>(<></>)
    const {nearbyDrivers} = useContext<LocationContextState>(LocationContext)
    const {getLatestDriverLocation, joinBookingRoom} = useContext<BookingContextState>(BookingContext)
    const dispatch = useDispatch()

    if(!mylocation.latitude || !mylocation.longitude) getCurrentPosition()
    const region = {
        latitude: mylocation.latitude || 14.5151763,
        longitude: mylocation.longitude || 121.0439442,
        // latitudeDelta: 0.09,
        // longitudeDelta: 0.035,
        latitudeDelta: 0.0043,
        longitudeDelta: 0.0035,
    }


    const initializeCurrentPosition = () => {
        console.log('Animate to current Location/Region')
    }

    console.log('map is rendering')

    useFocusEffect(
      useCallback(()=>{

          const getPendingData = async ()=> {
            try {
                let data: any =  await dispatch(bookingsAction.checkIFtheresPending())
                if(data != null){
                  let driverlocation: any = await bookingsAction.getDriverLastLocation(data.driverID._id)
                  joinBookingRoom( `Book_${data._id}`, data._id, "passenger")
                  if(data.status == 1){
                    getLatestDriverLocation({
                        latitude: driverlocation.location.coordinates[1] ,
                        longitude: driverlocation.location.coordinates[0]},
                        {
                            latitude: data.origin.latitude,
                            longitude: data.origin.longitude,
                        })
                  }else{

                  }
                }
             }catch(err){
                 console.log(err)
             }
          }

          getPendingData()

        
           
      },[mymapref])
    )

    const renderFunction = (): JSX.Element => {
        let display: JSX.Element = <></>
        if(bookings.Booking.id != ""){
            display = renderActiveBookings()
        }else{
            display = <BookDetails/>
        }
        return display
    }

    const renderActiveBookings = (): JSX.Element => {

        switch(bookings.Booking.status){
            case 0:
                return <WaitingForDrivertoAccept pickup={bookings.pickup} dropoff={bookings.dropoff} bookID={bookings.Booking.id}/>
            case 1:
                return <DriverOnTheWay/>
            default: 
                return <></>
        }
     
    }

    useEffect(()=>{
        setRenderDetails(renderFunction())
    },[bookings.Booking.id, bookings.Booking.status])


    return (
        <>
           <View style={styles.container}>
            <View style={styles.mapcontainer}>
            <Mapview
                       provider={PROVIDER_GOOGLE}
                       showsUserLocation={bookings.pickup.place == "" || bookings.dropoff.place == "" ? true : false}
                       initialRegion={region}
                       style={styles.map}
                    //    loadingEnabled={true}
                       rotateEnabled={false}
                       showsPointsOfInterest={false}
                       ref={mymapref}
                       showsCompass={false}
                       // onMapReady={onMapReady}
                   >

            
               <PinPoints mymapref={mymapref}/>


               {/* NEARBY DRIVERS */}

               {
                   bookings.pickup.place == "" && bookings.dropoff.place == ""
                   ? nearbyDrivers.map((driver: any, index: any): JSX.Element =>(
                       <>
                           <Marker
                                   key={index}
                                   coordinate={{latitude: driver.location.coordinates[1] ,longitude: driver.location.coordinates[0]}}
                                   image={require('../../../assets/img/motor2.png')}
                               >
                                    {/* <Image style={{height: 150 ,width: 150}} source={require('../../../assets/img/motor.png')}/> */}
                      
                           </Marker> 
                       </>
                   ))
                   : null
               }

               </Mapview>
               <MapHeaders initializeCurrentPosition={initializeCurrentPosition}/>
            </View>
               {
                   NetConnection 
                   ? renderDetails
                   : <NoInternet/>
               }
        </View>
        </>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        ...StyleSheet.absoluteFillObject,
    },
    mapcontainer: {
        flex:1,
        flexGrow: 1,
        flexShrink: 1,
    },
    map: {
        marginLeft: 2,
        height: height * 0.65,
        ...StyleSheet.absoluteFillObject,
    },
})

export default MapComponent