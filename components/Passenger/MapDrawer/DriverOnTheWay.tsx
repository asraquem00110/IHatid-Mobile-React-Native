import React, { useContext, useEffect, useState } from 'react'
import {StyleSheet, Dimensions, View , Text , TouchableOpacity} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import {useDispatch, useSelector} from 'react-redux'
import { Avatar } from 'react-native-paper'
import StarRating from 'react-native-star-rating'
import {useNavigation} from '@react-navigation/native'
import { BookingContext, BookingContextState } from '../../../context/sockets/BookingContext'
import { RootState } from '../../../redux/reducers'
import { ChatContext, IChatContextState } from '../../../context/sockets/ChatContext'

const { width, height } = Dimensions.get('window')

const DriverOnTheWay: React.FC = (): JSX.Element =>{
    const dispatch = useDispatch()
    const [rating,setRating] = useState<number>(4)
    const navigationHook = useNavigation()
    const {driverlocation} = useContext<BookingContextState>(BookingContext)
    const driverinfo = useSelector((state: RootState)=> state.bookings.Booking.driverID)
    const bookinfo = useSelector((state: RootState)=> state.bookings.Booking)
    const {joinChatRoom, unreadMessage} = useContext<IChatContextState>(ChatContext)

    useEffect(()=>{
        joinChatRoom(bookinfo.id)
    },[])

    return (
        <>
            <View style={styles.container}>
                    <View style={styles.welcome}>
                        <Text style={{fontSize: 16, fontWeight: 'bold', color: 'gray'}}>Hi I'm {driverinfo.fullname}</Text>
                    </View>
                    <View style={styles.info}>
                        <Text style={{fontSize: 16 ,color: "red", fontWeight: 'bold'}}>{driverlocation.distance} - {driverlocation.duration}</Text>
                        <Text style={{color: 'gray'}}>Your Driver is on the way</Text>
                        <Text style={{fontWeight: 'bold', fontSize: 18}}>{driverinfo.motorcyle.plateno} - {driverinfo.motorcyle.motorcycle} {driverinfo.motorcyle.description}</Text>
                    </View>
                    <View style={styles.profile}>
                            <View style={styles.rating}>
                                <Avatar.Image 
                                        style={{alignSelf: 'center', marginRight: 10}}
                                        // source={require('../../../assets/img/user.png')}
                                        source={driverinfo.picture ? {uri: driverinfo.picture} : require('../../../assets/img/user.png')}
                                        size={60}
                                    />

                                    <StarRating
                                            disabled={true}
                                            maxStars={5}
                                            rating={rating}
                                            selectedStar={(rating: number) => setRating(rating)}
                                            fullStarColor={'orange'}
                                            starSize={25}
                                            emptyStarColor={'orange'}
                                        />
                                            
                            </View>
                            <View style={styles.chat}>
                                <TouchableOpacity style={{position: 'relative'}} onPress={()=>navigationHook.navigate("Chat", {bookID: bookinfo.id})}>
                                        <Icon name="comment-dots" size={35} color="white"/>
                                        {unreadMessage > 0 ? <Text style={styles.messagecount}>{unreadMessage}</Text> : null}
                                 </TouchableOpacity>
                                
                            </View>
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
        height: height * 0.35,
        borderColor: 'silver',
        borderWidth: 0.5,
        flex: 1,
    },
    welcome: {
        flex: 1,
        padding: 10,
        width: width,
        justifyContent: 'center',
        alignItems: 'flex-start', 
        borderBottomColor: 'silver',
        borderBottomWidth: 0.5
    },
    info: {
        flex: 2,
        padding: 10,
        justifyContent: 'space-evenly',
        alignItems: 'flex-start', 
    },
    profile: {
        flexBasis: 70,
        backgroundColor: "#607D8B",
        width: width,
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center', 
        flexDirection: 'row'
    },
    rating: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    chat: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
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