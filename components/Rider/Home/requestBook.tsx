import React, { useContext } from 'react'
import {Modal,View,StyleSheet,Text, Alert , TouchableHighlight , TextInput } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../../redux/reducers'
import Icon from 'react-native-vector-icons/FontAwesome5'
import {roundToDecimal} from '../../../helper/helper'
import { driversAction } from '../../../redux/actions/driver'
import config from '../../../helper/config'
import io from 'socket.io-client'
import { BookingContext, BookingContextState } from '../../../context/sockets/BookingContext'

interface Props {
    requestModal: boolean,
    setRequestModal: (val: boolean)=> void ,
    myposition: {latitude: number, longitude: number} | null
}

const BookingSocketclient = io(`${config.BACKEND_URL}/booking`, { transports : ['websocket'] })

const RequestBooking: React.FC<Props> = ({requestModal , setRequestModal, myposition}):JSX.Element => {
    const PendingBook = useSelector((state: RootState)=>state.rider.pendingBooking)

    const dispatch = useDispatch()
    const {joinBookingRoom,displayDriver} = useContext<BookingContextState>(BookingContext)
    return (
        <>
             <Modal
                animationType="slide"
                transparent={true}
                visible={requestModal}
                onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                }}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={styles.bookingInfo}>
                            <Text style={{fontWeight: 'bold', fontSize: 16}}>Booking Request</Text>
                            <Text style={{fontWeight: 'bold', fontSize: 16}}>{PendingBook._id}</Text>
                            <View style={{marginTop: 10}}>
                                <Text>Name: {PendingBook.passengerID.fullname}</Text>
                                <Text>Email: {PendingBook.passengerID.email}</Text>
                                <Text>Contact: {PendingBook.passengerID.contactno}</Text>
                            </View>
                            <View style={{marginTop: 20}}>
                                        <View style={styles.pinpoints}>
                                                <View  style={{flexBasis: 40, justifyContent: 'center', alignItems: 'center'}}>
                                                            <Icon  color={'#607D8B'}name="map-marker-alt" size={15}
                                                        />
                                                </View>
                                                <TextInput 
                                                    editable={false}
                                                    multiline={true}
                                                    style={{color: 'gray',fontSize: 16,flexGrow: 1,flexShrink: 1,}} 
                                                    value={PendingBook.origin.place} 
                                                ></TextInput>
                                        
                                    </View>

                                    <View style={styles.pinpoints}>
                                                <View  style={{flexBasis: 40, justifyContent: 'center', alignItems: 'center'}}>
                                                            <Icon  color={'#ec1356'}name="map-marker-alt" size={15}
                                                        />
                                                </View>
                                                <TextInput 
                                                    editable={false}
                                                    multiline={true}
                                                    style={{color: 'gray',fontSize: 16,flexGrow: 1,flexShrink: 1,}} 
                                                    value={PendingBook.destination.place} 
                                                ></TextInput>
                                        
                                    </View>

                             </View>

                             <View style={{marginTop: 10, marginBottom: 10}}>
                                <Text>Distance: {PendingBook.distance.text}</Text>
                                <Text>Fare: P {roundToDecimal(PendingBook.price,2)}</Text>
                             </View>
                        </View>

                        <TouchableHighlight
                        style={{ ...styles.acceptBtn, backgroundColor: "#2196F3" }}
                        onPress={() => {
                            dispatch(driversAction.acceptBooking())
                            joinBookingRoom( `Book_${PendingBook._id}`, PendingBook._id, "driver")
                            displayDriver(`Book_${PendingBook._id}` , myposition , PendingBook)
                            setRequestModal(false)
                        }}
                        >
                        <Text style={styles.textStyle}><Icon name="check"/> Accept</Text>
                        </TouchableHighlight>
                    </View>
                    </View>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
     centeredView: {
        flex: 1,
        justifyContent: "center",
        backgroundColor: "rgba(0,0,0,0.3)"
      },
      modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 10,
        padding: 15,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      },
      acceptBtn: {
        backgroundColor: "#F194FF",
        borderRadius: 20,
        padding: 10,
        elevation: 2,
        width: "100%"
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
      modalText: {
        marginBottom: 15,
        textAlign: "center"
      },
      bookingInfo: {
          
      },
      pinpoints: {
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center'
      }
})

export default RequestBooking