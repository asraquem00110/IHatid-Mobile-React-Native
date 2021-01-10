import React , {useContext} from 'react'
import {View, StyleSheet, Text, ScrollView  , ImageBackground, TextInput , TouchableOpacity, Alert} from 'react-native'
import { Avatar } from 'react-native-paper'
import {useDispatch, useSelector} from 'react-redux'
import { RootState } from '../../redux/reducers'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { authActions } from '../../redux/actions/auth'
import { LocationContext, LocationContextState } from '../../context/sockets/LocationContext'
import { BookingContext, BookingContextState } from '../../context/sockets/BookingContext'


const Profile: React.FC = (): JSX.Element => {
    const auth = useSelector((state: RootState) => state.auth)
    const {disconnectLocationSocket} = useContext<LocationContextState>(LocationContext)
    const {disconnectBookingSocket} = useContext<BookingContextState>(BookingContext)
    const dispatch = useDispatch()

    const userSignOut = (): void => {
       
        Alert.alert("Hold on!", "Are you sure you want to Logout?", [
            {
              text: "Cancel",
              onPress: () => null,
              style: "cancel"
            },
            { text: "YES", onPress: () =>  {
                dispatch(authActions.signOut())
                disconnectLocationSocket()
                disconnectBookingSocket()
            } }
          ]);
    }
    
    return (
        <>
          <ScrollView>
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
                             <TouchableOpacity onPress={userSignOut}>
                                <View style={styles.signout}>
                                        <Text style={{color: 'red'}}><Icon name="power-off"/> Sign Out</Text>
                                </View>
                            </TouchableOpacity>
                    
                            <Text style={{ fontSize: 12}}> NAME</Text>
                            <TextInput value={auth.userinfo.fullname} editable={false} style={{borderBottomWidth: 1, marginBottom: 5, fontWeight: 'bold'}}/>
                            <Text style={{fontSize: 12}}> MOBILE NO</Text>
                            <TextInput value={auth.userinfo.contactno} editable={false} style={{borderBottomWidth: 1, marginBottom: 5, fontWeight: 'bold'}}/>
                            <Text style={{fontSize: 12}}> ADDRESS</Text>
                            <TextInput value={auth.userinfo.address} editable={false} style={{borderBottomWidth: 1, marginBottom: 5, fontWeight: 'bold'}}/>

                            <View style={styles.motorcylediv}>
                                <View style={styles.motorHeader}>
                                    <Text style={{fontWeight: 'bold'}}>MOTORCYLE DETAILS</Text>
                                </View>
                                <View style={styles.table}>
                                    <View style={styles.tableRow}>
                                        <View style={styles.tableDataTitle}>
                                            <Text style={styles.tableDataText}>NAME</Text>
                                        </View>
                                        <View style={styles.tableDataValue}>
                                            <Text style={styles.tableDataText}>{auth.userinfo.motorcyle.motorcycle}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.tableRow}>
                                         <View style={styles.tableDataTitle}>
                                         <Text style={styles.tableDataText}>DESCRIPTION</Text>
                                        </View>
                                        <View style={styles.tableDataValue}>
                                            <Text style={styles.tableDataText}>{auth.userinfo.motorcyle.description}</Text>
                                        </View>
                                    </View>

                                    <View style={styles.tableRow}>
                                        <View style={styles.tableDataTitle}>
                                        <Text style={styles.tableDataText}>PLATE NO</Text>
                                        </View>
                                        <View style={styles.tableDataValue}>
                                            <Text style={styles.tableDataText}>{auth.userinfo.motorcyle.plateno}</Text>
                                        </View>
                                    </View>
                                  
                                </View>
                            </View>

                    </View>
                </View>
            </ScrollView>
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
    },
    signout: {
        width: "100%",
        padding: 10,
        flex: 1,
        marginBottom: 10,
        borderColor: 'red',
        borderWidth: 1,
        borderRadius: 10,
        alignItems: 'center',
    },
    motorcylediv: {
        marginTop: 10,
    },
    motorHeader: {
        width: "100%",
        backgroundColor: "silver",
        padding: 10,
        justifyContent:'center',
        alignItems: 'center'
    },
    table: {
        flex: 1,
        backgroundColor: '#E6E3D0'
    },
    tableRow: {
        flex: 1,
        flexDirection: 'row',
        padding: 2,
    }, 
    tableDataTitle: {
        flex: 1,
        borderWidth: 1,
        borderColor: 'silver',
        borderRadius: 5,
        padding: 5,
    },
    tableDataValue: {
        flex: 2,
        borderWidth: 1,
        borderColor: 'silver',
        borderRadius: 5,
        padding: 5,
        marginLeft: 2,
    },
    tableDataText: {
        color: 'dimgray'
    }
})

export default Profile