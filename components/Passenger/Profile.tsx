import React , {useContext} from 'react'
import {View, StyleSheet, Text, Alert  , ImageBackground, TextInput} from 'react-native'
import { Avatar } from 'react-native-paper'
import {ProfileScreenRouteProp, ProfileNavigationProp} from './PassengerMainComponent'
import {useSelector} from 'react-redux'
import { RootState } from '../../redux/reducers'
import { ThemeContext, ThemeState } from '../../context/ThemeContext'
import { CustomDarkTheme, CustomDefaultTheme } from '../Theme'

interface Props {
    route: ProfileScreenRouteProp,
    navigation: ProfileNavigationProp
}

const Profile: React.FC<Props> = ({route,navigation}): JSX.Element => {
    const auth = useSelector((state: RootState) => state.auth)
    const {isDark} = useContext<ThemeState>(ThemeContext)
    const theme = isDark ? CustomDarkTheme : CustomDefaultTheme
    
    return (
        <>
            <View style={styles.container}>
                <View style={styles.profileimg}>
                        {/* <ImageBackground source={require('../../assets/img/profilebg.jpg')} style={styles.bgimage}>    */}
                              <Avatar.Image 
                                    style={{alignSelf: 'center', position: 'absolute', top: "50%"}}
                                    source={auth.userinfo.picture ? {uri: auth.userinfo.picture} : require('../../assets/img/user.png')}
                                    size={100}
                                />
                        {/* </ImageBackground> */}
                </View>
                <View style={styles.infodiv}>
                    <Text style={{color: theme.colors.text , fontSize: 12}}> NAME</Text>
                    <TextInput value={auth.userinfo.fullname} editable={false} style={{color: theme.colors.text,borderBottomColor: theme.colors.text, borderBottomWidth: 2, marginBottom: 10, fontWeight: 'bold'}}/>
                    <Text style={{color: theme.colors.text, fontSize: 12}}> MOBILE NO</Text>
                    <TextInput value={auth.userinfo.contactno} editable={false} style={{color: theme.colors.text,borderBottomColor: theme.colors.text, borderBottomWidth: 2, marginBottom: 10, fontWeight: 'bold'}}/>
                    <Text style={{color: theme.colors.text, fontSize: 12}}> ADDRESS</Text>
                    <TextInput value={auth.userinfo.address} editable={false} style={{color: theme.colors.text,borderBottomColor: theme.colors.text, borderBottomWidth: 2, marginBottom: 10, fontWeight: 'bold'}}/>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    bgimage: {
        flex: 1,
        resizeMode: "cover",
        justifyContent: "center"
    },
    profileimg: {
        height: 100,
        width: "100%",
        position: "relative",
        backgroundColor: "#607D8B"
    },
    infodiv: {
        marginTop: 50,
        padding: 15,
    }
})

export default Profile