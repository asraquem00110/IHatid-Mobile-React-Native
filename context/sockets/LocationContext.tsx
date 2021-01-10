import React, { createContext, useEffect, useRef, useState } from 'react'
import config from '../../helper/config'
import io from 'socket.io-client'
import { useDispatch } from 'react-redux'
import { driversAction } from '../../redux/actions/driver'


export interface LocationContextState {
    nearbyDrivers: Array<any>
    driverjoinOnline: (driver: string , lat: number , lng: number )=> void,
    disconnectLocationSocket: ()=> void,
    assignBooking: (socketID: string, driverID: string, booking: any)=> void,
    requestModal: boolean,
    closeRequestModal: ()=> void,
}

export const defaultValue: LocationContextState = {
    nearbyDrivers: [],
    driverjoinOnline: ()=> null,
    disconnectLocationSocket: ()=> null,
    assignBooking: ()=> null,
    requestModal: false,
    closeRequestModal: ()=> null,
}

export const LocationContext = createContext<LocationContextState>(defaultValue)

const LocationContextProvider: React.FC = (props) => {

    const ref = useRef<SocketIOClient.Socket>()
    const [nearbyDrivers,setNearbyDrivers] = useState<Array<any>>(defaultValue.nearbyDrivers)
    const [requestModal,setRequestModal] = useState<boolean>(defaultValue.requestModal)
    const dispatch = useDispatch()

    useEffect(()=>{
        let isMounted = true;
        if(isMounted){
            const socket = io(`${config.BACKEND_URL}/locations`, { transports : ['websocket'] })

            socket.on('connect',()=>{
                console.log('connected')
            })
    
            socket.on('disconnect',()=>{
                console.log('disconnect')
            })
    
            socket.on('reconnect',()=>{
                console.log('reconnect')
            })
    
    
            socket.emit('joinLocationRoom','NearbyDrivers')
    
            socket.on('NearbyDrivers',(drivers: any)=>{
                if(isMounted) setNearbyDrivers(drivers)
            })
    
            socket.on("requestingForAccept",(data: any)=>{
                dispatch(driversAction.setPendingBooking(data))
                if(isMounted) setRequestModal(true)
            })
    
    
            ref.current = socket
        }

        return ()=> {
            isMounted = false
        }
    

    },[])

    const DriverjoinOnline = (driverID: string, lat: number, lng: number): void => {
        ref.current?.emit('driverjoinOnline',{driverID: driverID, lat: lat, lng: lng})
    }   

    const DisconnectSocket = (): void => {
        ref.current?.disconnect()
    }

    const AssignBooking = (socketID: string, driverID: string, booking: any): void => {
        ref.current?.emit("assignBooking", {socketID: socketID, driverID: driverID, booking: booking})
    }

    const CloseRequestModal = (): void => setRequestModal(false)

    return (
        <LocationContext.Provider
            value={{
                nearbyDrivers: nearbyDrivers,
                driverjoinOnline: DriverjoinOnline,
                disconnectLocationSocket: DisconnectSocket,
                assignBooking: AssignBooking,
                requestModal: requestModal,
                closeRequestModal: CloseRequestModal
            }}
        >
            {props.children}
        </LocationContext.Provider>
    )
}

export default LocationContextProvider