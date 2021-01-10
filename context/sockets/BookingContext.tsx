import React, { createContext, useEffect, useRef, useState } from 'react'
import config from '../../helper/config'
import io from 'socket.io-client'
import {useDispatch} from 'react-redux'
import {bookingsAction} from '../../redux/actions/bookings'
import mappolyline from '@mapbox/polyline'
import axios from 'axios'

export interface BookingContextState {
    disconnectBookingSocket: ()=> void,
    joinBookingRoom: (room: string, bookID: string, type: string)=> void,
    displayDriver: (room: string , driverLocation: {latitude: number, longitude: number} | null , bookinfo: any)=> void,
    driverlocation: IDriverLocation,
    sendDriverLocation: (data: {latitude: number, longitude: number} | null , bookID: string , destination: any)=> void,
    getLatestDriverLocation: (driver: {latitude: number ,longitude: number}, destination: {latitude: number, longitude: number}) => void,
    bookingpolycoordinates: Array<any>,
}

const defaultValue: BookingContextState = {
    disconnectBookingSocket: ()=> null,
    joinBookingRoom: ()=> null,
    displayDriver: ()=> null,
    driverlocation: {latitude: 0 , longitude: 0 , distance: '' , duration: ''},
    sendDriverLocation: ()=> null,
    getLatestDriverLocation: ()=> null,
    bookingpolycoordinates: []
}  

export const BookingContext = createContext<BookingContextState>(defaultValue)

interface IDriverLocation {
    latitude: number,
    longitude: number,
    distance: string,
    duration: string,
}

const BookingContextProvider: React.FC = (props) => {

    const ref = useRef<SocketIOClient.Socket>()
    const [driverlocation,setDriverlocation] = useState<IDriverLocation>(defaultValue.driverlocation)
    const [bookingpolycoordinates,setBookingPolycoordinates] = useState(defaultValue.bookingpolycoordinates)
    const dispatch = useDispatch()

    const calculateDistance = async (origin: string,destination: string)=>{
        const resp = await axios.get(`https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${config.GOOGLEMAP_APIKEY}&mode=driving`)
        const points = mappolyline.decode(resp.data.routes[0].overview_polyline.points)
        const info = resp.data.routes[0].legs
        const coords = points.map((point: any)=>{
            return {
                latitude: point[0],
                longitude: point[1],
            }
        })

        setBookingPolycoordinates(coords)

        let driverlocation = origin.split(",")

        setDriverlocation({
            latitude: +driverlocation[0],
            longitude: +driverlocation[1],
            distance: info[0].distance.text,
            duration: info[0].duration.text,
        })
        
    }

    useEffect(()=>{
        let isMounted = true;
        if(isMounted) {
            const socket = io(`${config.BACKEND_URL}/booking`, { transports : ['websocket'] })

        
            socket.on('connect',()=>{
                console.log('connected')
            })
    
            socket.on('disconnect',()=>{
                console.log('disconnect')
            })
    
            socket.on('reconnect',()=>{
                console.log('reconnect')
            })
    
            socket.on('displayDriverInfo', (data: {driverLocation: any , bookinfo: any})=>{
                dispatch(bookingsAction.setDriverInfo(data.bookinfo))
                calculateDistance(`${data.driverLocation.latitude},${data.driverLocation.longitude}`,`${data.bookinfo.origin.latitude},${data.bookinfo.origin.longitude}`)
            })  
    
            socket.on('sendDriverLocation', async (data: {location: {latitude: number , longitude: number}, destination: any})=>{
                calculateDistance(`${data.location.latitude},${data.location.longitude}`,`${data.destination.latitude},${data.destination.longitude}`)
            })
    
    
            ref.current = socket
    
        }
        return () => {
            isMounted = false
        }
    },[])

    const DisconnectSocket = (): void => {
        ref.current?.disconnect()
    }

    const joinBookingRoom = (room: string, bookID: string, type: string): void => {
        ref.current?.emit('joinBookingRoom', { room :room, bookID: bookID, type: type})
    }
    
    const displayDriver = (room: string , driverLocation: {latitude: number, longitude: number} | null , bookinfo: any): void => {
        ref.current?.emit('displayDriver', {room: room , driverLocation: driverLocation , bookinfo: bookinfo})
    }

    const sendDriverLocation = (location: {latitude: number, longitude: number} | null , bookID: string , destination: any): void => {
        ref.current?.emit('sendDriverLocation', {location: location , room: `Book_${bookID}`, destination: destination})
    }

    const getLatestDriverLocation = (driver: {latitude: number ,longitude: number}, destination: {latitude: number, longitude: number}): void => {
        calculateDistance(`${driver.latitude},${driver.longitude}`,`${destination.latitude},${destination.longitude}`)
    }
    
    
    return (
        <BookingContext.Provider 
            value={{
                disconnectBookingSocket: DisconnectSocket,
                joinBookingRoom: joinBookingRoom,
                displayDriver: displayDriver,
                driverlocation: driverlocation,
                sendDriverLocation: sendDriverLocation,
                getLatestDriverLocation: getLatestDriverLocation,
                bookingpolycoordinates: bookingpolycoordinates
            }}
        >
                {props.children}
        </BookingContext.Provider>
    )
}

export default BookingContextProvider