import React, { lazy , useRef , useEffect, useContext } from 'react'
import {Dimensions, Alert , BackHandler} from 'react-native'
import {NavigationContainer, RouteProp} from '@react-navigation/native'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack'


const MapComponent = lazy(()=> import('./Home/MapComponent'))
const ProfileComponent = lazy(()=> import('./Profile'))
const ChatComponent = lazy(()=>import('../Bookings/Chat'))
const HistoryComponent = lazy(()=> import('./History/HistoryComponent'))


const {width,height} = Dimensions.get('window')
const MaterialBottomTabs = createMaterialBottomTabNavigator()
const StackNav = createStackNavigator()


export type RootStackParamList = {
  Home: undefined;
  Chat: {bookID: string},
};

export type ChatScreenRouteProp = RouteProp<RootStackParamList, "Chat">
export type ChatNavigationProp = StackNavigationProp<RootStackParamList, "Chat">


const RiderMainComponent: React.FC = (): JSX.Element => {
    const NavigationRef = useRef<any>(null)

    useEffect(()=>{
        const backAction = () => {
          const currentRoute = NavigationRef.current.getCurrentRoute()
          if(currentRoute.name === "Home"){
               Alert.alert("Hold on!", "Are you sure you want to close the App?", [
                {
                  text: "Cancel",
                  onPress: () => null,
                  style: "cancel"
                },
                { text: "YES", onPress: () => BackHandler.exitApp() }
              ]);
           }else{
              NavigationRef.current.goBack()
           }
          return true;
        };
    
        const backHandler = BackHandler.addEventListener(
          "hardwareBackPress",
          backAction
        );
    
        return () => backHandler.remove();
        
      },[])

    const HomeStackScreen = (): JSX.Element => (
        <>
            <StackNav.Navigator
                initialRouteName="Home"
            >
                <StackNav.Screen name="Home" component={MapComponent} options={{title: 'Map' , headerShown: false}}/>
                <StackNav.Screen name="Chat" component={ChatComponent} options={{title: ''}}/>
          
            </StackNav.Navigator>
        </>
    )

    const HistoryStackScreen = (): JSX.Element => (
        <>
            <StackNav.Navigator
                initialRouteName="History"
            >
                <StackNav.Screen name="History" component={HistoryComponent}/>
                <StackNav.Screen name="Book Info" component={HistoryComponent} options={{title: 'Booking Info'}}/>

            </StackNav.Navigator>
        </>
    )

    
    return (
        <>
           <NavigationContainer ref={NavigationRef}>
                <MaterialBottomTabs.Navigator
                    initialRouteName="Home"
                    barStyle={{ backgroundColor: '#607D8B' }}
                >
                        <MaterialBottomTabs.Screen name="Home" component={HomeStackScreen} options={{
                             tabBarIcon: ({color}) => (
                                <Icon color={color} style={{fontWeight: "bold", fontSize: 18}} name={'map-search'} />
                              ),
                        }} />

                        <MaterialBottomTabs.Screen name="History" component={HistoryStackScreen} options={{
                             tabBarIcon: ({color}) => (
                                <Icon color={color} style={{fontWeight: "bold", fontSize: 18}} name={'notebook-multiple'} />
                              ),
                        }} />

                        <MaterialBottomTabs.Screen name="Profile" component={ProfileComponent} options={{
                             tabBarIcon: ({color}) => (
                                <Icon color={color} style={{fontWeight: "bold", fontSize: 18}} name={'account'} />
                              ),
                        }} />

                </MaterialBottomTabs.Navigator>
           </NavigationContainer>
        </>
    )
}


export default RiderMainComponent