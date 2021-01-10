import React, { useContext, useEffect, useState } from 'react'
import {StyleSheet, Dimensions, View , Text , TouchableOpacity, Alert} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import Spinner from 'react-native-spinkit'
import { bookingsAction ,BookingsAction } from '../../../redux/actions/bookings'
import {useDispatch} from 'react-redux'
import { LocationContext, LocationContextState } from '../../../context/sockets/LocationContext'

const { width, height } = Dimensions.get('window')

interface PinPoint {
    place: string,
    latitude: number,
    longitude: number,
}

interface Props {
    pickup: PinPoint,
    dropoff: PinPoint,
    bookID: string,
}

const WaitingForDriver: React.FC<Props> = ({pickup,dropoff,bookID}): JSX.Element =>{
    const dispatch = useDispatch()
    const [timer,setTimer] = useState<number>(120)
    const {assignBooking} = useContext<LocationContextState>(LocationContext)

    useEffect(()=>{
        let findTimer = setTimeout(async ()=>{
            if(timer > 0){
                try{
                    let response: any = await dispatch(bookingsAction.findDriver(bookID, [pickup.longitude, pickup.latitude] , [dropoff.longitude, dropoff.latitude]))
                        if(response.booking) {
                            assignBooking(response.socketID, response.driverID , response.booking)
                            clearTimeout(findTimer)
                            setTimer(-1)
                        }
                }catch(err){
                    console.log(err)
                }
                setTimer(state=> state - 1)
            }else if(timer == 0){
                Alert.alert("Sorry! No Driver is near in your Area, Try again after 2 to 5 mins.")
                dispatch(bookingsAction.cancelBooking())
            }
            
        },1000)

        return ()=> {
            clearTimeout(findTimer)
        }
    },[timer])

    return (
        <>
            <View style={styles.container}>
                <Text style={{marginBottom: 10, fontSize: 16}}>Processing your request</Text>
                <Spinner size={60} isVisible={true} color="#077AE9" type="Pulse"/>
                <View style={{flexDirection: 'row'}}>
                    <View  style={{flexBasis: 30 , justifyContent: 'center', alignItems: 'center'}}>
                          <Icon name="map-marker-alt" color="blue" size={20} />
                    </View>
                    <Text style={{flexGrow: 1,flexShrink: 1,fontSize: 16 , color: 'gray'}}>{pickup.place}</Text>
                </View>

                <View style={{flexDirection: 'row', paddingTop: 10, paddingBottom: 10}}>
                    <View  style={{flexBasis: 30 , justifyContent: 'center', alignItems: 'center'}}>
                          <Icon name="map-marker-alt" color="red" size={20} />
                    </View>
                    <Text style={{flexGrow: 1,flexShrink: 1,fontSize: 16 , color: 'gray'}}>{dropoff.place}</Text>
                </View>
                <View style={{flexGrow: 1, justifyContent: 'flex-end' ,alignItems: 'center'}}>
                    <Text style={{fontSize: 10, color: 'silver', marginBottom: 10}}>By Booking you confirm that you accept our Terms and Conditions.</Text>
                    <TouchableOpacity onPress={()=>dispatch(bookingsAction.cancelBooking())} style={{marginTop: 5, marginBottom: 5, flexDirection: "row"}}>
                            <View style={{padding: 5, borderWidth: 1 , borderColor: "red" , borderRadius: 10, width: "100%", alignItems: 'center'}}>
                                <Text style={{color: "red"}}><Icon name="times"/> Cancel</Text>
                            </View>    
                    </TouchableOpacity>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: "white",
        width: width,
        height: height * 0.40,
        borderColor: 'silver',
        borderWidth: 0.5,
        flex: 1,
        alignItems: 'center',
        padding: 10,
    },
})

export default WaitingForDriver