import React, { useEffect, useState , useContext } from 'react'
import {View,StyleSheet,Text , TextInput, TouchableOpacity, ActivityIndicator, Alert} from 'react-native'
import {useNavigation, useRoute } from '@react-navigation/native'
import {ConfirmationScreenRouteProp,ConfirmationNavigationProp} from '../LoginComponent'
import Icon from 'react-native-vector-icons/FontAwesome5'
import {ThemeContext,ThemeState} from '../../context/ThemeContext'
import {useDispatch} from 'react-redux'
import {authActions} from '../../redux/actions/auth'
import { oauthActions } from '../../redux/actions/oauth'
import { Facebook } from '../../redux/actions/oauth/Facebook'

interface Props {
    route: ConfirmationScreenRouteProp,
    navigation: ConfirmationNavigationProp
}

const ConfirmationCode: React.FC<Props> = ({route,navigation}): JSX.Element => {

    const routehook = useRoute<ConfirmationScreenRouteProp>()
    const navigationhook = useNavigation<ConfirmationNavigationProp>()
    const themeContext = useContext<ThemeState>(ThemeContext)
    const dispatch = useDispatch()

    const [pin,setPin] = useState<string>('')
    const [timer,setTimer] = useState<number>(20)
    useEffect(()=>{
        setTimeout(()=>{
            if(timer > 0) setTimer(state=> state - 1)
            
        },1000)
    },[timer])

    const requestNewCode = (): void => {
        dispatch(authActions.requestNewPin(routehook.params.mobileno))
        setTimer(20)
    }
    const changePIN = (text: any) => {
        let num = text.replace(/[^0-9]/g,'')
        setPin(num)
    }

    const VerifyPin = async () => {
        themeContext.apiLoadingChange(true)
        try {
            let result
            if(!routehook.params.oauth){
                result = await dispatch(authActions.verifyPin(pin, routehook.params.mobileno))
            }else{
                result = await dispatch(oauthActions.register(new Facebook(),pin, routehook.params.mobileno))
            }
            if(!result) Alert.alert("Invalid PIN code!")
            
        }catch(err: any){
            console.log(err)
        }
        themeContext.apiLoadingChange(false)
    }

    return (
        <>
            <View style={styles.container}>
                <View style={styles.code}>
                  <Text style={{fontSize: 16,color: 'dimgray', marginBottom: 10}}>Enter the verification PIN sent to {`+63${routehook.params.mobileno}`}</Text>
                 <TextInput value={pin} onChangeText={(text)=>changePIN(text)} style={{fontSize: 26,paddingTop: 10, paddingBottom: 10,paddingLeft: 20,paddingRight: 20, backgroundColor: 'white',textAlign: 'center', borderRadius: 10}} autoFocus={true} placeholder={'0 0 0 0'} maxLength={4} keyboardType={'numeric'}/>
                 {themeContext.apiLoading ? <ActivityIndicator style={{marginTop: 20}} size="large" color="silver" /> : <></>}
                </View>
                <View style={styles.resend}>
                        <View style={{flex: 1}}>
                        <Text style={{color: 'dimgray'}}>Didn't receive it?</Text>
                            {
                                <TouchableOpacity style={{flexDirection: 'row', alignItems: 'flex-end'}} disabled={timer > 0} onPress={requestNewCode}>
                                    <Text>Request a new PIN</Text>
                                    {timer > 0 ? <Text style={{color: 'dimgray', fontSize: 12}}> in {timer} s</Text> : null }
                                </TouchableOpacity>
                            }
                        </View>
                        <View style={{flex: 1, alignItems: 'flex-end'}}>
                                <TouchableOpacity onPress={VerifyPin} disabled={pin.length < 4} style={{padding: 15, backgroundColor: 'white', borderRadius: 50,borderWidth: 0.5,borderColor: 'silver'}}>
                                    <Icon name="arrow-right" size={20}/>
                                </TouchableOpacity>
                        </View>
                
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
    },
    code: {
        flex: 1,
        justifyContent: 'flex-start',
    },
    resend: {
        flex: 1,
        flexDirection: 'row',
        alignSelf: 'flex-start',
        alignItems: 'flex-end'
    }
})

export default ConfirmationCode