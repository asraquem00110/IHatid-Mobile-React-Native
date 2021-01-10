import React from 'react'
import {View, StyleSheet , Text , Dimensions , Image } from 'react-native'
import { useSelector } from 'react-redux'
import { RootState } from '../../../redux/reducers'
import StarRating from 'react-native-star-rating'

const {width,height} = Dimensions.get("window")

const DriverInfo: React.FC = (): JSX.Element => {

    const auth = useSelector((state: RootState)=> state.auth)

    return (
        <>
        <View style={styles.container}>
            <View style={styles.viewimg}>
                    <Image 
                        source={auth.userinfo.picture ? {uri: auth.userinfo.picture} : require('../../../assets/img/user.png')}
                        style={{height: "100%", width: "100%", borderRadius: 10 }}
                        resizeMode="cover"
                    />
            </View>

            <View style={styles.viewinfo}>
                <Text style={{...styles.infotext}}> {auth.userinfo.fullname}</Text>
                <Text style={{...styles.infotext, fontSize: 12}}> {auth.userinfo.contactno}</Text>
                <View style={styles.rating}>
                    <StarRating
                            disabled={true}
                            maxStars={5}
                            rating={4}
                            fullStarColor={'orange'}
                            starSize={18}
                            emptyStarColor={'orange'}
                        />
                </View>
                <Text style={{...styles.infotext, fontSize: 12}}> {auth.userinfo.motorcyle.motorcycle} - {auth.userinfo.motorcyle.plateno}</Text>
            </View>
        </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 0,
        width: width,
        height: 100,
        backgroundColor: "rgba(0,0,0,0.5)",
        padding: 10,
        flex: 1,
        flexDirection: "row"
    },
    viewimg: {
        width: width * 0.25,
        height: "100%",
    },
    viewinfo: {
        flexGrow: 1,
        marginLeft: 10,
    },
    infotext: {
        color: "white",
        fontSize: 18,
    },
    rating: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        paddingLeft: 2,
    }
})

export default DriverInfo