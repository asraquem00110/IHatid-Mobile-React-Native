
import React , {memo, useCallback, useEffect, useState} from 'react'
import {View,StyleSheet, FlatList , ListRenderItem , Text , TouchableOpacity , Dimensions} from 'react-native'
import axios from 'axios'
import config  from '../../../../helper/config'
import Icon from 'react-native-vector-icons/FontAwesome5'
import {useDispatch, useSelector} from 'react-redux'
import {bookingsAction} from '../../../../redux/actions/bookings'
import { RootState } from '../../../../redux/reducers'
import {useNavigation} from "@react-navigation/native"

const {height,width} = Dimensions.get('window')

interface Props {
    filter: string,
    value: string,
}

interface FlatListPlaceMapData {
    place_id: string,
    mainText: string,
    secondaryText: string,
}

const SearchResult: React.FC<Props> = ({filter,value}): JSX.Element => {

    const [places,setPlaces] = useState<Array<FlatListPlaceMapData>>([])
    const dispatch = useDispatch()
    const bookings = useSelector((state: RootState)=> state.bookings)
    const navigationHook = useNavigation()

    const findPossiblePlaces = ()=>{
        axios.post(`https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${config.GOOGLEMAP_APIKEY}&input=${value}&region=ph`)
            .then((results: any)=>{
                // console.log(results.data.predictions)
                let formattedData: Array<FlatListPlaceMapData> = results.data.predictions.map((data: any)=>(
                    {
                        place_id: data.place_id,
                        mainText: data.structured_formatting.main_text,
                        secondaryText: data.structured_formatting.secondary_text
                    }
                ))
                setPlaces(formattedData)
            })
            .catch(err=>console.log(err))
    }

    // const memoizeCB = useCallback(()=>findPossiblePlaces(),[value])

    useEffect(()=>{
        findPossiblePlaces()
    },[value])

    const savePlace = (Placeid: string) => {
        axios.get(`https://maps.googleapis.com/maps/api/place/details/json?key=${config.GOOGLEMAP_APIKEY}&place_id=${Placeid}&fields=place_id,geometry/location,name,adr_address`)
            .then((result: any)=>{
                if(filter === "pickup"){
                    dispatch(bookingsAction.setPickupAt(result.data.result))
                }else{
                    dispatch(bookingsAction.setDropoff(result.data.result))
                }
                if(bookings.pickup.place != "" && bookings.dropoff.place != "") navigationHook.navigate("Home")
            })
            .catch(err=>console.log(err))
    }

    const renderItem: ListRenderItem<FlatListPlaceMapData> = ({item})=> (
        <>
           
            
            <View style={styles.placeitem}>
                <TouchableOpacity onPress={()=>savePlace(item.place_id)} style={styles.placeinfo}>
                     <View>
                         <Text style={{fontWeight: 'bold'}}>{item.mainText}</Text>
                         <Text style={{fontSize: 12, color: 'dimgray'}}>{item.secondaryText}</Text>
                    </View>
                </TouchableOpacity>

                <View style={styles.addLocation}>
                        <Icon 
                            color={'#ec1356'}
                            name="bookmark" 
                            size={20}
                    />
                </View>
           
            </View>
        </>
    )

    return (
        <>
            <View style={styles.container}>
                <View style={styles.places}>
                    <FlatList<FlatListPlaceMapData>
                        data={places}
                        renderItem={renderItem}
                        keyExtractor={(item)=> item.place_id}
                        extraData={places}    
                    >
                        
                    </FlatList>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        width: "100%",
        backgroundColor: "white",
        marginTop: 15
    },
    places: {
        flex: 1,
        padding: 10,
    },
    placeitem: {
        flexDirection: "row",
        borderBottomWidth: 0.5,
        borderColor: 'silver',
        paddingTop: 10,
        paddingBottom: 10,
    },
    placeinfo: {
        flexBasis: width * 0.85,
        // backgroundColor: "red"
    },
    addLocation: {
        flexBasis: width * 0.15,
        display: 'flex',
        justifyContent: 'center',
    }
})

function PropsAreEqual(prevState: Props, nextState: Props) {
    return prevState.value === nextState.value
  }

export default SearchResult