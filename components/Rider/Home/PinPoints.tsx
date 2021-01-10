import React, { useContext, useEffect, useState } from 'react'
import { Marker , Polyline } from 'react-native-maps'
import { IPendingBook } from '../../../redux/reducers/driver'
import {Image} from 'react-native'
import { BookingContext, BookingContextState } from '../../../context/sockets/BookingContext'

interface Props {
    myposition: {latitude: number, longitude: number} | null
    mymapref: React.MutableRefObject<any>,
    PendingBook: IPendingBook
}

const PinPoints: React.FC<Props> = ({myposition, mymapref, PendingBook}): JSX.Element => {

    const [destination,setDestination] = useState<{latitude: number , longitude: number} | null>(myposition)
    const {bookingpolycoordinates} = useContext<BookingContextState>(BookingContext)

    useEffect(()=>{
        if(PendingBook._id != "" && PendingBook.status == 1) setDestination({latitude: PendingBook.origin.latitude,longitude: PendingBook.origin.longitude})
        fitToMap()
    },[myposition])

    const fitToMap = (): void => {
        mymapref.current.fitToCoordinates([
            myposition,
            destination
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

    return (
        <>
            {
                PendingBook.status == 1
                ?   <Marker
                        key={'dropoff'}
                        coordinate={{latitude: PendingBook.origin.latitude ,longitude: PendingBook.origin.longitude}}
                    >
                        <Image style={{height: 50,width:50}} source={require('../../../assets/img/pickup.png')}/>
                    </Marker> 
                : PendingBook.status == 2
                ?   <></>
                : null
            }

            {
                PendingBook.status > 0
                ?   <Polyline
                        strokeWidth={5}
                        strokeColor="red"
                        coordinates={bookingpolycoordinates}
                    />
                : null
            }
        </>
    )
}

export default PinPoints