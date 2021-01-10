import React , {useContext, useEffect} from 'react'
import {StyleSheet,View, Dimensions , Text , Image , TouchableOpacity, Alert } from 'react-native'
import * as Animatable from 'react-native-animatable'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import {AuthContext,AuthState} from '../../context/AuthContext'
import {useNavigation} from '@react-navigation/native'
import {useDispatch , useSelector} from 'react-redux'
import {oauthActions} from '../../redux/actions/oauth'
import {Facebook} from '../../redux/actions/oauth/Facebook'
import { RootState } from '../../redux/reducers'

const {width,height} = Dimensions.get('window')

export enum oauthtype {
    facebook = "facebook",
    google = "google",
}


const Login: React.FC = (): JSX.Element => {
    const {facebookLogin} = useContext<AuthState>(AuthContext)
    const navigationHook = useNavigation()
    const dispatch = useDispatch()
    const oauth = useSelector((state: RootState)=> state.oauth)


    useEffect(()=>{
        if(!oauth.fbexist) navigationHook.navigate('registerNo', {oauth: true,type: oauthtype.facebook})
    })

    return (
        <>
            <View style={styles.container}>
                <View style={styles.title}>
                              
                        <Animatable.Text style={{fontSize: 50,color: 'white'}}
                          animation="slideInDown"
                          duration={500}
                        >
                               IH<Icon 
                                    color={'#354A54'}
                                    name="racing-helmet" 
                                    size={40}
                                />tid
                        </Animatable.Text>
                </View>

                <Animatable.View style={styles.form}
                     animation="slideInUp"
                     duration={500}
                > 
                    <Image style={{...styles.formimg,width: "70%",height: "100%",borderRadius: 10}} resizeMode={'cover'} source={require('../../assets/img/tracking.png')} />
                    <View style={styles.loginoptions}>
                            <TouchableOpacity onPress={()=>navigationHook.navigate("registerNo", {oauth: false})} style={styles.formlogin}>
                                <View style={{...styles.formbtn,backgroundColor: 'gray'}}>
                                    <Text style={{color: 'white'}}><Icon name="cellphone" /> Get Started</Text>
                                </View>
                            </TouchableOpacity>

                            <Text>or continue with</Text>

                            <TouchableOpacity onPress={()=>dispatch(oauthActions.oauthlogin(new Facebook()))} style={styles.formfbbtn}>
                                <View style={styles.formbtn}>
                                    <Text style={{color:'white'}}><Icon name="facebook" size={20}/>  Facebook</Text>
                                </View>
                            </TouchableOpacity>

                            <Text style={{color: 'gray',fontSize: 10}}>&copy; Alvin Sison Raquem 2020</Text>
                            <View>
                            </View>
                    </View>
                </Animatable.View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#607D8B',
    },
    title: {
        flex: 1,
        backgroundColor: '#607D8B',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    form: {
        flex: 2,
        backgroundColor: 'white',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    formimg: {
        flex: 1,
    },
    loginoptions: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#F0F2F5",
        width: width
    },
    formlogin: {
        width: width*0.75,
        margin: 10,
    },
    formfbbtn: {
        width: width*0.75,
        margin: 10,
    },
    formbtn: {
        height: 50,
        backgroundColor: "#0E90F2",
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center',
        borderRadius: 10,
    }
})


export default Login