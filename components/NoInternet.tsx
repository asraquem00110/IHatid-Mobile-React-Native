import React from 'react'
import {StyleSheet,Dimensions,View , Image , Text } from 'react-native'

const { width, height } = Dimensions.get('window')
const NoInternet: React.FC = (): JSX.Element => {
    return (
        <>
          <View style={styles.container}>
                <View style={styles.permissionCheck_img}>
                    <Image style={{width: "100%",height: "100%",borderRadius: 10}} resizeMode={'center'} source={require('../assets/img/wifi.png')} />
                </View>
                <View style={styles.permissionCheck_text}>
                    <Text style={{fontSize: 16,fontWeight: 'bold',textAlign: 'center'}}>Please check your internet connection.</Text>
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

export default NoInternet