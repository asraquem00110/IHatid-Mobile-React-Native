import React, { useState } from 'react'
import {TextInput, StyleSheet , View , TouchableWithoutFeedback , TouchableOpacity , Text} from 'react-native'
import {useRoute} from '@react-navigation/native'
import { PlaceScreenRouteProp } from '../../PassengerMainComponent'
import { useSelector } from 'react-redux'
import { RootState } from '../../../../redux/reducers'
import Icon from 'react-native-vector-icons/FontAwesome5'
import SearchResult from './SearchResult'


const Place: React.FC = (): JSX.Element => {
    const routehook = useRoute<PlaceScreenRouteProp>()
    const bookings = useSelector((state: RootState)=> state.bookings)

    const [pickup, setPickup] = useState<string>(bookings.pickup.place)
    const [dropoff, setDropoff] = useState<string>(bookings.dropoff.place)
    const [filter,setFilter] = useState<string>('')
    const [search,setSearch] = useState<string>('')
    const [typingTimer,setTypingTimer] = useState<any>(null)

    const searchPlace = (filter: string,value: string) => {
        clearTimeout(typingTimer)
        if(value.length > 0){
            setTypingTimer(setTimeout(()=>{
                setFilter(filter)
                setSearch(value)
            },1500)
            )
        }
    }


    return (
        <>
        <View style={styles.container}>
            <View style={{backgroundColor: 'white',padding: 10,}}>
                <View style={styles.pickup}>
                             <View  style={{flexBasis: 40, justifyContent: 'center', alignItems: 'center'}}>
                                        <Icon 
                                            color={'#607D8B'}
                                            name="location-arrow" 
                                            size={15}
                                    />
                            </View>
                            <TextInput 
                                style={{color: 'gray',fontSize: 16,flexGrow: 1,flexShrink: 1,fontWeight: bookings.pickup.place !== "" ? 'bold' : 'normal'}} 
                                placeholder={'Pick up at ...'} 
                                value={pickup} 
                                onChangeText={(text)=>{setPickup(text); searchPlace('pickup', text)}} 
                                autoFocus={routehook.params.filter === "pickup"}></TextInput>
                            {
                                pickup.length > 0
                                ? <TouchableOpacity onPress={()=>setPickup('')}>
                                    <Icon color={'#607D8B'} style={{marginRight: 10}} name="times" size={20}/>
                                </TouchableOpacity>
                                : null
                            }
                            
                </View>

                <View style={styles.dropoff}>
                             <View  style={{flexBasis: 40, justifyContent: 'center', alignItems: 'center'}}>
                                        <Icon 
                                            color={'#ec1356'}
                                            name="map-marker-alt" 
                                            size={15}
                                    />
                            </View>
                            <TextInput 
                                style={{color: 'gray',fontSize: 16 , flexShrink: 1, flexGrow: 1,fontWeight: bookings.dropoff.place !== "" ? 'bold' : 'normal'}} 
                                placeholder={'Drop off at ...'} 
                                value={dropoff} 
                                onChangeText={(text)=>{setDropoff(text); searchPlace('dropoff', text)}} 
                                autoFocus={routehook.params.filter === "dropoff"}></TextInput>
                            {
                                dropoff.length > 0
                                ? <TouchableOpacity onPress={()=>setDropoff('')}>
                                    <Icon color={'#607D8B'} style={{marginRight: 10}} name="times" size={20}/>
                                </TouchableOpacity>
                                : null
                            }
                </View>
               
            </View>

            <TouchableOpacity style={styles.choosefromMap}>
                        <View  style={{flexBasis: 40, justifyContent: 'center', alignItems: 'center'}}>
                            <Icon 
                                color={'blue'}
                                name="map" 
                                size={15}
                        />
                        </View>
                        <Text style={{fontSize: 16}}> Choose From Map</Text>
            </TouchableOpacity>

            <SearchResult filter={filter} value={search}/>
                
        </View>
               
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    pickup: {
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center'
    },
    dropoff: {
        flexDirection: "row",
        justifyContent: 'center',
        alignItems: 'center'
    },
    choosefromMap: {
        marginTop: 15,
        width: "100%",
        padding: 10,
        backgroundColor: "white",
        flexDirection: "row"
    }
})

export default Place