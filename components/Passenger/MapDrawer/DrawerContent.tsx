import React , {useContext} from 'react'
import {View,StyleSheet, Alert , TouchableOpacity, Image} from 'react-native'
import {DrawerContentScrollView , DrawerItem} from '@react-navigation/drawer'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import {ThemeContext,ThemeState} from '../../../context/ThemeContext'
import {
    useTheme,
    Avatar,
    Title,
    Caption,
    Paragraph,
    Drawer,
    Text,
    TouchableRipple,
    Switch
} from 'react-native-paper'
import {useDispatch , useSelector} from 'react-redux'
import {authActions} from '../../../redux/actions/auth'
import {RootState} from '../../../redux/reducers/index'
import { LocationContext, LocationContextState } from '../../../context/sockets/LocationContext'
import { BookingContextState , BookingContext} from '../../../context/sockets/BookingContext'

const DrawerContent = (props: any)=> {
    const paperTheme = useTheme()
    const {toggleTheme} = useContext<ThemeState>(ThemeContext)
    const dispatch = useDispatch()
    const auth = useSelector((state: RootState) => state.auth)
    const {disconnectLocationSocket} = useContext<LocationContextState>(LocationContext)
    const {disconnectBookingSocket} = useContext<BookingContextState>(BookingContext)

    const userSignOut = (): void => {
       
        Alert.alert("Hold on!", "Are you sure you want to Logout?", [
            {
              text: "Cancel",
              onPress: () => null,
              style: "cancel"
            },
            { text: "YES", onPress: () => {
                dispatch(authActions.signOut())
                disconnectLocationSocket()
                disconnectBookingSocket()
            } }
          ]);
    }

    return (
        <>
             <View style={styles.container}>
                <DrawerContentScrollView {...props}>
                    <View style={styles.drawerContent}>
                        <TouchableOpacity onPress={()=>{props.navigation.navigate('Profile'); props.navigation.closeDrawer()}}>
                        <View style={styles.userInfoSection}>
                            <View style={styles.infoSection}>
                                <Avatar.Image 
                                    style={{alignSelf: 'center'}}
                                    source={auth.userinfo.picture ? {uri: auth.userinfo.picture} : require('../../../assets/img/user.png')}
                                    size={60}
                                />

                                <View style={{marginLeft:15, flexDirection:'column'}}>
                                    <Title style={styles.title}>{auth.userinfo.fullname}</Title>
                                    <Caption style={styles.caption}>{auth.userinfo.contactno}</Caption>
                                </View>

                            </View>
                        </View>
                        </TouchableOpacity>

                        <Drawer.Section style={styles.drawerSection}>
                                <DrawerItem 
                                    icon={({color, size}) => (
                                        <Icon 
                                        name="folder-edit-outline" 
                                        color={color}
                                        size={size}
                                        />
                                    )}
                                    label="History"
                                    onPress={() => {props.navigation.navigate('History'); props.navigation.closeDrawer()}}
                                />

                                <DrawerItem 
                                    icon={({color, size}) => (
                                        <Icon 
                                        name="information-variant" 
                                        color={color}
                                        size={size}
                                        />
                                    )}
                                    label="Anouncements"
                                    onPress={() => {props.navigation.navigate('About')}}
                                />

                                <DrawerItem 
                                    icon={({color, size}) => (
                                        <Icon 
                                        name="map-marker-outline" 
                                        color={color}
                                        size={size}
                                        />
                                    )}
                                    label="My Locations"
                                    onPress={() => {props.navigation.navigate('About')}}
                                />

                                <DrawerItem 
                                    icon={({color, size}) => (
                                        <Icon 
                                        name="racing-helmet" 
                                        color={color}
                                        size={size}
                                        />
                                    )}
                                    label="Be a Rider"
                                    onPress={() => {props.navigation.navigate('BeaRider'); props.navigation.closeDrawer()}}
                                />

                        </Drawer.Section>
                        <Drawer.Section title="Preferences">
                        <TouchableRipple onPress={() => {toggleTheme()}}>
                            <View style={styles.preference}>
                                <Text>Dark Theme</Text>
                                <View pointerEvents="none">
                                    <Switch value={paperTheme.dark}/>
                                </View>
                            </View>
                        </TouchableRipple>
                    </Drawer.Section>

                    </View>
                </DrawerContentScrollView>
                <Drawer.Section style={styles.bottomDrawerSection}>
                <DrawerItem 
                    icon={({color, size}) => (
                        <Icon 
                        name="exit-to-app" 
                        color={color}
                        size={size}
                        />
                    )}
                    label="Sign Out"
                    onPress={userSignOut}
                />
            </Drawer.Section>
             </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    drawerContent: {
        flex: 1,
    },
    userInfoSection: {
        padding: 20,
    },
    infoSection: {
        flexDirection:'row',
        alignContent: 'center'
    },
    title: {
        fontSize: 16,
        marginTop: 3,
        fontWeight: 'bold',
    },
    caption: {
        fontSize: 14,
        lineHeight: 14,
    },
    drawerSection: {
        marginTop: 15,
    },
    bottomDrawerSection: {
        borderTopColor: '#f4f4f4',
        borderTopWidth: 1
    },
    preference: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
})

export default DrawerContent