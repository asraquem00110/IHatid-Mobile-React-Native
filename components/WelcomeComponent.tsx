import React, { useState } from 'react'
import {View,StyleSheet,Image , Text , TextInput , TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import {useDispatch} from 'react-redux'
import {authActions} from '../redux/actions/auth'

const WelcomeComponent: React.FC = (): JSX.Element =>{

    const [fullname,setFullname] = useState<string>('')
    const [address,setAddress] = useState<string>('')

    const dispatch = useDispatch()

    return (
        <>
            <View style={styles.container}>
                <View style={styles.welcomeimg}>
                        <Image 
                            source={require('../assets/img/welcome.png')}
                            resizeMode='center'
                            style={{width: "100%",flex: 1}}
                        />
                </View>

                <View style={styles.welcomeform}>
                    <Text style={{marginBottom: 20}}>
                        Please Update First Your Information.
                    </Text>

                    <TextInput value={fullname} onChangeText={(text)=>setFullname(text)} placeholder="Fullname" style={styles.forminput}/>
                    <TextInput value={address} onChangeText={(text)=>setAddress(text)} placeholder="Address" style={styles.forminput}/>

                    <View style={{flex: 1, justifyContent: 'flex-end',  alignSelf: 'flex-end'}}>
                                <TouchableOpacity onPress={()=> dispatch(authActions.initializeInfo(fullname,address))} disabled={fullname.length == 0} style={{padding: 20, backgroundColor: 'white', borderRadius: 50,borderWidth: 0.5,borderColor: 'silver'}}>
                                    <Icon name="arrow-right" size={25}/>
                                </TouchableOpacity>
                     </View>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    welcomeimg: {
        flex: 1,
        backgroundColor: "white",
    },
    welcomeform: {
        flex: 2,
        backgroundColor: "#F0F2F5",
        padding: 20,
    },
    forminput: {
        fontSize: 16,
        backgroundColor: "white",
        marginBottom: 10,
        borderRadius: 5,
    }
})

export default WelcomeComponent