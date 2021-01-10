import React from 'react'
import {StyleSheet,Dimensions,View , Image , Text } from 'react-native'

const { width, height } = Dimensions.get('window')
const LocationServiceOff: React.FC = (): JSX.Element => {
    return (
        <>
          <View style={styles.container}>
                <View style={styles.permissionCheck_img}>
                    <Image style={{width: "100%",height: "100%",borderRadius: 10}} resizeMode={'center'} source={require('../assets/img/map.png')} />
                </View>
                <View style={styles.permissionCheck_text}>
                    <Text style={{fontSize: 16,fontWeight: 'bold',textAlign: 'center'}}>Please Turn on your Location.</Text>
                </View>
          </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "white",
        width: width,
        height: height * 0.25,
        borderColor: 'silver',
        borderWidth: 0.5,
    },
    permissionCheck_img: {
        flex: 0.6,
        justifyContent: 'center',
        alignItems: 'center'
    },
    permissionCheck_text: {
        flex: 0.2,
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 20,
        paddingRight: 20,
    },
})

export default LocationServiceOff