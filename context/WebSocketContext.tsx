import React, { createContext, useEffect, useRef } from 'react'
import LocationContextProvider from './sockets/LocationContext'
import BookingContextProvider from './sockets/BookingContext'
import ChatContextProvider from './sockets/ChatContext'

const WebSocketContextProvider: React.FC = (props): JSX.Element => {

    return (
        <>
            <LocationContextProvider>
                <BookingContextProvider>  
                    <ChatContextProvider>   
                         {props.children}
                    </ChatContextProvider>
                </BookingContextProvider>
            </LocationContextProvider>
        </>
    )
}

export default WebSocketContextProvider