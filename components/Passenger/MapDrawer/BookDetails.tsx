import React, { useContext } from 'react'
import {View,StyleSheet,Dimensions,Text, Alert , Button , PermissionsAndroid , Image} from 'react-native'
import { TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/FontAwesome5'
import {useSelector,useDispatch} from 'react-redux'
import { RootState } from '../../../redux/reducers'
import {useNavigation} from '@react-navigation/native'
import { bookingsAction } from '../../../redux/actions/bookings'
import { roundToDecimal } from '../../../helper/helper'
import { BookingContext, BookingContextState } from '../../../context/sockets/BookingContext'

const { width, height } = Dimensions.get('window')


const BookDetails: React.FC = (): JSX.Element => {

    const bookings = useSelector((state: RootState)=> state.bookings)
    const dispatch = useDispatch()
    const navigation = useNavigation()
    const {joinBookingRoom} = useContext<BookingContextState>(BookingContext)

    return (
        <>
              <View style={styles.bottomdetails}>
                                <View style={styles.pickup}>
                                    <View  style={{flexBasis: 30, justifyContent: 'center', alignItems: 'center'}}>
                                        <Image style={{ height: '50%' , width: '100%', marginLeft: 10}} resizeMode={'cover'} source={require('../../../assets/img/pickup.png')}></Image>
                                    </View>
                                    <View>
                                    <TouchableWithoutFeedback onPress={()=>navigation.navigate('Place',{filter: 'pickup'})} style={{width: width, height: "100%", display: 'flex', justifyContent: 'center',paddingLeft: 10}}>
                                        <Text style={{color: 'gray',fontSize: 16, fontWeight: bookings.pickup.place !== "" ? 'bold' : 'normal'}}>{bookings.pickup.place === "" ? 'Pick up at ...' : bookings.pickup.place}</Text>
                                    </TouchableWithoutFeedback>
                                    </View>
                                    {  
                                    bookings.pickup.place != '' && bookings.dropoff.place != ''
                                    ? <View style={{height: "75%", top: "-75%",width: width, backgroundColor: "rgba(0,0,0,0.4)" , position: 'absolute', display: 'flex' , justifyContent: 'center', alignItems: 'center'}}>
                                        <Text style={{fontWeight: 'bold', color: 'white', fontSize: 16}}>{bookings.distance.text} - {bookings.traveltime}</Text>
                                     </View> 
                                    : null
                                    }
                                </View>
                                <View style={styles.dropoff}>
                                    <View  style={{flexBasis: 30, justifyContent: 'center', alignItems: 'center' ,position: 'relative'}}>
                                            <Image style={{ height: '50%' , width: '100%',marginLeft: 10}} resizeMode={'cover'} source={require('../../../assets/img/dropoff.png')}></Image>
                                    </View>
                                    <View>
                                    <TouchableWithoutFeedback onPress={()=>navigation.navigate('Place',{filter: 'dropoff'})} style={{width: width, height: "100%", display: 'flex', justifyContent: 'center',paddingLeft: 10}}>
                                        <Text style={{color: 'gray',fontSize: 16, fontWeight: bookings.dropoff.place !== "" ? 'bold' : 'normal'}}>{bookings.dropoff.place === "" ? 'Drop off at ...' : bookings.dropoff.place}</Text>
                                    </TouchableWithoutFeedback>
                                    </View>
                                </View>
                                <View style={styles.service}>
                                        <View  style={{flexBasis: 50, justifyContent: 'center', alignItems: 'center'}}>
                                             <Icon 
                                                    color={'#1876F2'}
                                                    name="motorcycle" 
                                                    size={25}
                                            />
                                        </View>

                                        <View style={{flexGrow: 1, justifyContent: 'center', paddingLeft: 20}}>
                                            <Text style={{fontWeight: 'bold'}}>Passenger Service  <Icon 
                                                    color={'#1876F2'}
                                                    name="angle-double-right" 
                                            /></Text>
                                        </View>
                                        {
                                            bookings.pickup.place != '' && bookings.dropoff.place != ''
                                            ? <View style={{flexGrow: 1,justifyContent: 'center', alignItems: 'center', marginRight: 20}}>
                                                <Text style={{fontSize: 20,}}>&#8369; {roundToDecimal(bookings.price,2)}</Text>
                                            </View>
                                            : null
                                        }
                                        
                                </View>
                                <View style={styles.bookbtn}>
                                    <TouchableHighlight disabled={bookings.pickup.place === "" || bookings.dropoff.place === "" || bookings.price == 0 } 
                                                        onPress={async ()=> {
                                                            try {
                                                                let response: any = await dispatch(bookingsAction.createBooking())
                                                                if(response._id) joinBookingRoom(`Book_${response._id}`, response._id, "passenger")
                                                            }catch(err){
                                                                console.log(err)
                                                            }
                                                        }} 
                                                        style={{width: width, height: "100%", display: 'flex', justifyContent: 'center', alignItems: 'center'}}
                                            >
                                        <Text style={styles.booktext}>Book</Text>
                                    </TouchableHighlight>
                                </View>
                        </View>
        </>
    )
}

const styles = StyleSheet.create({
    bottomdetails: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: "white",
        width: width,
        height: height * 0.35,
        borderColor: 'silver',
        borderWidth: 0.5,
        flex: 1,
    },
    pickup: {
        flex: 1,
        flexDirection: "row",
        position: 'relative',
    },
    dropoff: {
        flex: 1,
        flexDirection: "row",
    },
    service: {
        flex: 1,
        flexDirection: "row",
        backgroundColor: "#F0F2F5"
    },
    bookbtn: {
        flex: 1,
        backgroundColor: "#607D8B",
        justifyContent: 'center',
        alignItems: 'center'
    },
    booktext: {
        color: "white",
        fontWeight: 'bold',
        fontSize: 20
    }

})

export default BookDetails