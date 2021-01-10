import React from 'react'
import {View , StyleSheet,Dimensions} from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Icon from 'react-native-vector-icons/FontAwesome5'
import {useNavigation,DrawerActions} from '@react-navigation/native'
const { width, height } = Dimensions.get('window')


const MapHeaders: React.FC<{initializeCurrentPosition: ()=> void }> = ({initializeCurrentPosition}): JSX.Element => {

    const navigationHook = useNavigation()

    return (
        <>
        <View style={styles.header}>
                <TouchableOpacity  onPress={()=> navigationHook.dispatch(DrawerActions.toggleDrawer())}>
                    <View style={styles.toggledrawer}>
                            <Icon name="bars" size={30}/>
                    </View>
                </TouchableOpacity>
        </View>


            
        {/* <View style={styles.targetLocation}>
                <TouchableOpacity  onPress={initializeCurrentPosition}>
                    <View style={styles.togglecurrentLocation}>
                            <Icon name="bullseye" size={15}/>
                    </View>
                </TouchableOpacity>
        </View> */}
        </>
    )
}

const styles = StyleSheet.create({
    targetLocation: {
        marginRight: 10,
        marginBottom: 8,
        position: 'absolute',
        bottom: height * 0.35,
        right: 0,
        backgroundColor: "white",
        width: 30,
        height: 30,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        borderColor: 'silver',
        borderWidth: 0.5,
        zIndex: 5,
    },
    togglecurrentLocation: {
        height: "100%",
        width: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        marginLeft: 10,
        marginTop: 10,
        position: 'absolute',
        top: 0,
        backgroundColor: "white",
        width: 60,
        height: 60,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        borderColor: 'silver',
        borderWidth: 0.5
    },
    toggledrawer: {
        height: "100%",
        width: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export default MapHeaders