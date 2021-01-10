import React, { useState } from 'react'
import {View, Text , StyleSheet, Dimensions , TouchableOpacity , Alert} from 'react-native'
import Spinner from 'react-native-spinkit'
import Icon from 'react-native-vector-icons/FontAwesome5'
import {authActions} from '../../redux/actions/auth'
import {useDispatch} from 'react-redux'
import { TextInput } from 'react-native-gesture-handler'

const {width , height} = Dimensions.get('window')

export interface IMotorcyle {
    motorcycle: string,
    description: string,
    plateno: string
}


type Key = "motorcycle" | "description" | "plateno"

const BeaRiderComponent: React.FC = (): JSX.Element => {

    const dispatch = useDispatch()
    const [motorcyleInfo,setMotorcyleInfo] = useState<IMotorcyle>({ motorcycle: '', description: '', plateno: ''})

    const changeMotorcyleInfo = (key: Key, value: string) => {

        setMotorcyleInfo((prevstate)=> {
            prevstate[key] = value
            return {...prevstate}
        })
    }

    const [motorError, setMotorError] = useState<IMotorcyle>({ motorcycle: '', description: '', plateno: ''})

    const ChangeMotorError = (key: Key, value: string) => {
        setMotorError((prevstate)=>{
            prevstate[key] = value
            return {...prevstate}
        })
    }

    const confirmed = ()=>{
        Alert.alert(
            "Confirmation",
            "Are you sure you want to continue?",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              { text: "OK", onPress: async () => {
                try{
                    let response: any = await dispatch(authActions.beARider(motorcyleInfo))
                    if(response.errors){
                        if(response.errors.motorcycle) ChangeMotorError("motorcycle", response.errors.motorcycle)
                        if(response.errors.description) ChangeMotorError("description", response.errors.description)
                        if(response.errors.plateno) ChangeMotorError("plateno", response.errors.plateno)
                    }
                }catch(err){    
                    console.log(err)
                }
              } }
            ],
            { cancelable: false }
          );
      
    }

    return (
        <>
            <View style={styles.container}>
                <Text style={{fontSize: 20 ,color: 'dimgray' , fontWeight: 'bold'}}>Become a Rider of <Text style={{color: 'black'}}>IHatid</Text></Text>
                <View>
                    <Spinner size={width*0.5} isVisible={true} color="#077AE9" type="ThreeBounce"/>
                </View>
                <View style={styles.motorcyleForm}>
                        <TextInput value={motorcyleInfo.motorcycle} onChangeText={(text)=>changeMotorcyleInfo("motorcycle",text)} style={styles.input} placeholder="Motorcyle" />
                        {motorError.motorcycle != "" ? <Text style={{fontSize: 8 , color: "red"}}>{motorError.motorcycle}</Text> : null}
                        <TextInput value={motorcyleInfo.description} onChangeText={(text)=>changeMotorcyleInfo("description",text)} style={styles.input} placeholder="Description" />
                        {motorError.description != "" ? <Text style={{fontSize: 8 , color: "red"}}>{motorError.description}</Text> : null}
                        <TextInput value={motorcyleInfo.plateno} onChangeText={(text)=>changeMotorcyleInfo("plateno",text)} style={styles.input} placeholder="Plate No" />
                        {motorError.plateno != "" ? <Text style={{fontSize: 8 , color: "red"}}>{motorError.plateno}</Text> : null}
                </View>
                <View style={{flexGrow: 1}}>
                    <Text style={{fontSize: 14, color: 'dimgray'}}>By tapping the continue button below you agree to the <Text style={{color: 'black' , fontWeight: 'bold'}}>Terms and Conditions</Text> of IHatid.</Text>
                    <TouchableOpacity onPress={confirmed} style={{marginTop: 20}}>
                        <View style={{width: "100%", padding: 10, borderColor: '#077AE9', borderWidth: 1,borderRadius: 10 ,alignItems: 'center'}}>
                                <Text style={{color: '#077AE9', fontSize: 16}}><Icon name="check"/> Proceed</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
    },
    motorcyleForm: {
        width: "100%"

    },
    input: {
        color: 'gray',
        fontSize: 16,
        flexGrow: 1,
        flexShrink: 1,
        backgroundColor: 'white',
        marginTop: 5,
        marginBottom: 5,
        borderRadius: 5,
        
    }
})

export default BeaRiderComponent