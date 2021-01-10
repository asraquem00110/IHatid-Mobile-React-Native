import React , {useState,useContext} from 'react'
import {StyleSheet,View ,TouchableOpacity , Image , Text , TextInput , ActivityIndicator} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome5'
import {authActions} from '../../redux/actions/auth'
import {useSelector,useDispatch} from 'react-redux'
import {ThemeContext,ThemeState} from '../../context/ThemeContext'
import {useNavigation, useRoute} from '@react-navigation/native'
import {RegisterScreenRouteProp} from '../LoginComponent'
import {oauthtype} from './Login'
import { oauthActions } from '../../redux/actions/oauth'

const Register: React.FC = (): JSX.Element =>{

    const [number,setNumber] = useState<string>('')
    const dispatch = useDispatch()
    const themeContext = useContext<ThemeState>(ThemeContext)
    const routehook = useRoute<RegisterScreenRouteProp>()
    const navigationhook = useNavigation()

    const changenumber = (text: any) => {
        let num = text.replace(/[^0-9]/g,'')
        setNumber(num)
    }

    const login = async () => {
        themeContext.apiLoadingChange(true)
        try {
            if(!routehook.params.oauth){
                let data: any = await dispatch(authActions.mobilelogin(number))
                navigationhook.navigate('confirmationNo', {mobileno: number, oauth: false})
            }else{
                let data: any = await dispatch(oauthActions.addVerificationPin(number))
                if(data) navigationhook.navigate('confirmationNo', {mobileno: number, oauth: true, type: oauthtype.facebook})
            }
          
        }catch(err: any){
            console.log(err)
        }
        themeContext.apiLoadingChange(false)
    }

    return (
        <>
            <View style={styles.container}>
              
                <Text style={{display: 'flex', alignSelf: 'flex-start',marginBottom: 10}}>Enter your mobile number</Text>
                <View style={styles.number}>
                    <View style={styles.php}>
                        <Image resizeMode={'stretch'} source={require('../../assets/img/flag.png')} style={{height: '40%' , width: '40%'}} /> 
                        <Text style={{fontWeight: 'bold'}}> +63</Text>
                    </View>
                    <View style={styles.no}>
                        <TextInput style={{fontSize: 20,padding: 10}} autoFocus={true} value={number} onChangeText={(text)=> changenumber(text)} placeholder={'0 0 0 0 0 0 0 0 0 0'} maxLength={10} keyboardType={'numeric'}/>
                    </View>
                </View>

                
                {themeContext.apiLoading ? <ActivityIndicator style={{marginTop: 20}} size="large" color="silver" /> : <></>}

                <View style={styles.proceedformbtn}>
                        <View style={{flex: 2}}>
                        <Text style={{color: 'dimgray'}}>Were sending you a verification PIN to your mobile number.</Text>
                           
                        </View>
                        <View style={{flex: 1, alignItems: 'flex-end'}}>
                                <TouchableOpacity onPress={login} disabled={number.length < 10} style={{padding: 15, backgroundColor: 'white', borderRadius: 50,borderWidth: 0.5,borderColor: 'silver'}}>
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
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    number: {
        flexDirection: 'row',
        marginBottom: 10,
        flexBasis: 50,
        width: "100%"
    },
    php: {
        display: "flex",
        flexDirection: 'row',
        backgroundColor: "silver",
        flexBasis: 80,
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,

    },
    no: {
        marginLeft: 5,
        backgroundColor: "white",
        flexGrow: 1,
        borderRadius: 5,
    },
    btn: {
        flexBasis: 50,
        width: "100%",
        marginTop: 10,
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    proceedformbtn: {
        flex: 1,
        flexDirection: 'row',
        alignSelf: 'flex-start',
        alignItems: 'flex-end'
    }
})

export default Register