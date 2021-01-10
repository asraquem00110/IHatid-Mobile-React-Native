import React , {useState , useContext, useEffect , useCallback, lazy} from 'react'
import {Image} from 'react-native'
import {Marker,Polyline} from 'react-native-maps'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../redux/reducers'
import { bookingsAction } from '../../../redux/actions/bookings'
import axios from 'axios'
import config  from '../../../helper/config'
import mappolyline from '@mapbox/polyline'
import { BookingContext, BookingContextState } from '../../../context/sockets/BookingContext'

const BookDetails = lazy(()=>import('./BookDetails'))
const WaitingForDrivertoAccept = lazy(()=>import('./WatingForDriver'))
const DriverOnTheWay = lazy(()=>import('./DriverOnTheWay'))

interface Props {
    mymapref: any
}

const PinPoints: React.FC<Props> = ({mymapref}):JSX.Element => {

    const bookings = useSelector((state: RootState)=> state.bookings)
    const {driverlocation,bookingpolycoordinates} = useContext<BookingContextState>(BookingContext)
    const [polycoordinates,setPolycoordinates] = useState([])
    const dispatch = useDispatch()
    // const [destination,setDestination] = useState<{latitude: number , longitude: number}>({latitude: driverlocation.latitude, longitude: driverlocation.longitude})

    useEffect(()=>{
        if(bookings.Booking.status == 1){
            console.log(driverlocation)
            // setDestination({latitude: bookings.pickup.latitude ,longitude: bookings.pickup.longitude})
            fitToMapDriverPickup()
        }
    },[driverlocation])

    const fitToMapDriverPickup = ()=> {
        let destination: Array<{latitude: number ,longitude: number}> = []
        if(bookings.Booking.status == 1) {
            destination = [
                {latitude: driverlocation.latitude,longitude: driverlocation.longitude},
                {latitude: bookings.pickup.latitude ,longitude: bookings.pickup.longitude}
            ]
        }

        mymapref.current.fitToCoordinates(destination, 
          {
            animated: true,
            edgePadding: {
              top: 150,
              right: 150,
              bottom: 100,
              left: 150,
            },
          })

    }

    const fitToMap = useCallback(()=> {
        if(bookings.pickup.place != "" && bookings.dropoff.place != ""){
            mymapref.current.fitToCoordinates([
                {latitude: bookings.pickup.latitude,longitude: bookings.pickup.longitude},
                {latitude: bookings.dropoff.latitude ,longitude: bookings.dropoff.longitude}
            ], 
              {
                animated: true,
                edgePadding: {
                  top: 150,
                  right: 150,
                  bottom: 100,
                  left: 150,
                },
              })
        }
   
    },[mymapref])

    const getCoordinates = async (origin: string,destination: string)=>{
        try {
            const resp = await axios.get(`https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${config.GOOGLEMAP_APIKEY}&mode=driving`)
            const points = mappolyline.decode(resp.data.routes[0].overview_polyline.points)
            const info = resp.data.routes[0].legs
            const coords = points.map((point: any)=>{
                return {
                    latitude: point[0],
                    longitude: point[1],
                }
            })

            setPolycoordinates(coords)
            dispatch(bookingsAction.setOthersInfo({text: info[0].distance.text, value: info[0].distance.value} , info[0].duration.text ))
        
        }catch(err){
            console.log(err)
        }
    }

    useEffect(()=>{
        if(bookings.pickup.place != "" && bookings.dropoff.place != "" && bookings.Booking.status == 0){
            getCoordinates(`${bookings.pickup.latitude},${bookings.pickup.longitude}`,`${bookings.dropoff.latitude},${bookings.dropoff.longitude}`)
            fitToMap()
        }
    },[bookings.pickup.latitude, bookings.pickup.longitude,bookings.dropoff.latitude, bookings.dropoff.longitude])


    return (
        <>
                { 
                   bookings.pickup.place != "" && bookings.dropoff.place != "" && bookings.Booking.id == ""
                   ? <Polyline
                       strokeWidth={5}
                       strokeColor="red"
                       coordinates={polycoordinates}
                   />
                   : bookings.Booking.id != "" && bookings.Booking.status > 0
                   ? <Polyline
                        strokeWidth={5}
                        strokeColor="red"
                        coordinates={bookingpolycoordinates}
                    />
                   : null
               }

               {
                   bookings.pickup.place != ""
                   ?   <Marker
                           key={'pickup'}
                           coordinate={{latitude: bookings.pickup.latitude ,longitude: bookings.pickup.longitude}}
                       >
                           <Image style={{height: 50,width:50}} source={require('../../../assets/img/pickup.png')}/>
                       </Marker> 
                   : null
               }

               {
                   bookings.dropoff.place != ""
                   ?   <Marker
                           key={'dropoff'}
                           coordinate={{latitude: bookings.dropoff.latitude ,longitude: bookings.dropoff.longitude}}
                       >
                           <Image style={{height: 50,width:50}} source={require('../../../assets/img/dropoff.png')}/>
                       </Marker> 
                   : null
               }

               {
                   bookings.Booking.status > 0
                   ?  <Marker
                        key={'motorRider'}
                        coordinate={{latitude: driverlocation.latitude ,longitude: driverlocation.longitude}}
                        image={require('../../../assets/img/motor2.png')}
                    >

                        {/* <Image style={{height: 150 ,width: 150}} source={require('../../../assets/img/motor.png')}/> */}

                    </Marker> 
                   : null
               }
        </>
    )
}

export default PinPoints