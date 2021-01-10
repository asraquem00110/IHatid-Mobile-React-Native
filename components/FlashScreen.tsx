import React from 'react'
import {View,StyleSheet,Dimensions,Text , Image  , TouchableOpacity , BackHandler} from 'react-native'
import * as Animatable from 'react-native-animatable'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const {width,height} = Dimensions.get('window')

interface Props {
    permission: boolean | null | undefined,
    isConnected: boolean | null | undefined,
    checkInternet: ()=> void,
    turnonLocation: ()=> void,
}

const FlashScreen: React.FC<Props> = ({permission,isConnected,checkInternet,turnonLocation}): JSX.Element =>{

    
    return (
        <>
            <View style={styles.container}>
                     <Animatable.Text style={{fontSize: 50,color: 'white'}}
                          animation="bounceIn"
                          duration={1500}
                        >
                              
                              IH<Icon 
                                    color={'#354A54'}
                                    name="racing-helmet" 
                                    size={40}
                                />tid
                        </Animatable.Text>
                {
                    isConnected
                    ? !permission
                    ?  <View style={styles.permissionCheck}>
                            <View style={styles.permissionCheck_img}>
                                <Image style={{width: "100%",height: "100%",borderRadius: 10}} resizeMode={'cover'} source={require('../assets/img/map.png')} />
                            </View>
                            <View style={styles.permissionCheck_text}>
                                <Text style={{fontSize: 16,fontWeight: 'bold',textAlign: 'center'}}>IHatid App needs your location to work properly. Please turn on your location.</Text>
                            </View>
                            <View style={styles.permissionCheck_btn}>
                                    <TouchableOpacity onPress={()=>turnonLocation()}>
                                        <View style={{width: width * 0.80, height: "70%", backgroundColor: "#607D8B", borderRadius: 20, justifyContent: 'center', alignItems: 'center'}}>
                                            <Text style={{color: 'white',fontWeight: 'bold', fontSize: 20}}>Turn on Location Service</Text>
                                        </View>
                                    </TouchableOpacity>
                            </View>
                       </View>
                    : <></>
                    :  <View style={styles.internetCheck}>
                               <View style={styles.permissionCheck_img}>
                                <Image style={{width: "100%",height: "100%",borderRadius: 10}} resizeMode={'stretch'} source={require('../assets/img/wifi.png')} />
                            </View>
                            <View style={styles.permissionCheck_text}>
                                <Text style={{fontSize: 16,fontWeight: 'bold',textAlign: 'center'}}>Please check your internet connection.</Text>
                            </View>
                            <View style={styles.internetCheck_btn}>
                                    <TouchableOpacity onPress={checkInternet}>
                                        <View style={{borderWidth: 1, borderColor: 'green', width: width * 0.40, height: "70%", backgroundColor: "white", borderRadius: 20, justifyContent: 'center', alignItems: 'center'}}>
                                            <Text style={{color: 'green',fontWeight: 'bold', fontSize: 20}}>Retry</Text>
                                        </View>
                                    </TouchableOpacity>
                                    <View style={{width: width * 0.05}}></View>
                                    <TouchableOpacity onPress={()=>BackHandler.exitApp()}>
                                        <View style={{borderWidth: 1, borderColor: 'maroon', width: width * 0.40, height: "70%", backgroundColor: "white", borderRadius: 20, justifyContent: 'center', alignItems: 'center'}}>
                                            <Text style={{color: 'maroon',fontWeight: 'bold', fontSize: 20}}>Cancel</Text>
                                        </View>
                                    </TouchableOpacity>
                            </View>
                      </View>
                }

               
            </View>
        </>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        backgroundColor: '#607D8B',
    },
    internetCheck: {
        width: width * 0.95,
        height: height * 0.60,
        position: 'absolute',
        zIndex: 1,
        backgroundColor: "white",
        borderRadius: 10,
    },
    permissionCheck: {
        width: width * 0.95,
        height: height * 0.60,
        position: 'absolute',
        backgroundColor: "white",
        borderRadius: 10,
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
    permissionCheck_btn: {
        flex: 0.2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    internetCheck_btn: {
        flex: 0.2,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    }
})

export default FlashScreen