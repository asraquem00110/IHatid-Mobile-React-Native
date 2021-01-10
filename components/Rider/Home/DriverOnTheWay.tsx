import React, { useContext, useEffect } from 'react'
import {View,Text,StyleSheet , TextInput , Image , TouchableOpacity} from 'react-native'
import { BookingContext, BookingContextState } from '../../../context/sockets/BookingContext'
import { IPendingBook } from '../../../redux/reducers/driver'
import Icon from 'react-native-vector-icons/FontAwesome5'
import {useNavigation} from '@react-navigation/native'
import { ChatContext, IChatContextState } from '../../../context/sockets/ChatContext'

interface Props {
    PendingBook: IPendingBook
}

const DriverOnTheWay: React.FC<Props> = ({PendingBook}): JSX.Element => {
    const {driverlocation} = useContext<BookingContextState>(BookingContext)
    const navigationHook = useNavigation()

    const {joinChatRoom , unreadMessage} = useContext<IChatContextState>(ChatContext)

    useEffect(()=>{
        joinChatRoom(PendingBook._id)
    },[])
    
    return (
        <>
            <View style={styles.container}>
                   {/* <Text>{JSON.stringify(driverlocation)}</Text> */}
                   <View style={styles.tripdetails}>
                       <View style={styles.pinpoint}>
                            <View  style={{flexBasis: 40, justifyContent: 'center', alignItems: 'center'}}>
                                        <Icon 
                                            color={'blue'}
                                            name="map-marker-alt" 
                                            size={15}
                                    />
                            </View>
                            <TextInput 
                             editable={false}
                             style={{color: 'gray',fontSize: 16 , flexShrink: 1, flexGrow: 1}} 
                             value={PendingBook.origin.place}
                             multiline={true}
                             >

                            </TextInput>
                        </View>
                        <View style={styles.distance}>
                             <View  style={{flexBasis: 40, justifyContent: 'center', alignItems: 'center'}}>
                                        <Icon 
                                            color={'#607D8B'}
                                            name="clock" 
                                            size={15}
                                    />
                            </View>
                            <Text style={{color: "red", fontSize: 16, marginLeft: 3}}>{`${driverlocation.distance} - ${driverlocation.duration}`}</Text>
                        </View>
                   </View>

                   <View style={styles.passenger}>
                        <View style={styles.passengerImg}>
                            <Image 
                            source={PendingBook.passengerID.picture ? {uri: PendingBook.passengerID.picture} : require('../../../assets/img/user.png')} 
                            style={{height: "80%", width: "80%" , borderRadius: 10}}
                            />
                        </View>
                        <View style={styles.passengerInfo}>
                                <Text>{PendingBook.passengerID.fullname}</Text>
                                <Text style={{fontSize: 12, color: 'gray'}}>{PendingBook.passengerID.contactno}</Text>
                                <Text style={{fontSize: 12, color: 'gray'}}>{PendingBook.passengerID.email}</Text>
                        </View>
                        <TouchableOpacity  onPress={()=>navigationHook.navigate("Chat", {bookID: PendingBook._id})}  style={styles.chat}>
                                     <Icon 
                                            color={'#607D8B'}
                                            name="comment-dots" 
                                            size={40}
                                    />
                                     {unreadMessage > 0 ? <Text style={styles.messagecount}>{unreadMessage}</Text> : null}
                        </TouchableOpacity>
                   </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        height: 150,
        backgroundColor: "white"
    },
    tripdetails: {
        flex: 1,
    },
    pinpoint: {
        flexDirection: "row",
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    distance: {
        flexDirection: "row",
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    passenger: {
        flexBasis: 70,
        backgroundColor: "#F5F5F5",
        flexDirection: "row"
    },
    passengerImg: {
        flexBasis: 70,
        justifyContent: "center",
        alignItems: "center"
    },
    passengerInfo: {
        flexGrow: 1,
        flexShrink: 1,
        padding: 5,
    },
    chat: {
        flexBasis: 70,
        justifyContent: "center",
        alignItems: "center",
        position: 'relative'
    },
    messagecount: {
        position: "absolute",
        bottom: 0,
        zIndex: 1,
        right: 0,
        fontWeight: 'bold',
        color: "white",
        backgroundColor: "lime",
        padding: 2,
        paddingLeft: 5,
        paddingRight: 5,
        borderRadius: 100
    }
})

export default DriverOnTheWay