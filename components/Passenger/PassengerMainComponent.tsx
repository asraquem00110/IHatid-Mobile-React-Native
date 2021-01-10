import React , {useContext,useRef, useEffect , lazy} from 'react'
import {View,Text,StatusBar, Alert , BackHandler , TouchableOpacity} from 'react-native'
import {NavigationContainer , RouteProp, StackActions} from "@react-navigation/native"
import {createStackNavigator , StackNavigationProp} from '@react-navigation/stack'
import {createDrawerNavigator} from '@react-navigation/drawer'
import {CustomDefaultTheme,CustomDarkTheme} from '../../components/Theme'
import {ThemeContext,ThemeState} from '../../context/ThemeContext'
import {Provider as PaperProvider} from 'react-native-paper'

const Stack = createStackNavigator()
const Drawer = createDrawerNavigator()

const DrawerContent = lazy(()=>import('../../components/Passenger/MapDrawer/DrawerContent'))
const MapComponent = lazy(()=>import('../../components/Passenger/MapDrawer/MapComponent'))
const HistoryComponent = lazy(()=>import('../../components/Passenger/History/HistoryComponent'))
const ProfileComponent = lazy(()=>import('../../components/Passenger/Profile'))
const PlaceComponent = lazy(()=>import('../../components/Passenger/MapDrawer/Bookings/Place'))
const ChatComponent = lazy(()=>import('../../components/Bookings/Chat'))
const BeaRiderComponent = lazy(()=>import('../../components/Passenger/BeaRider'))

export type RootStackParamList = {
  Home: undefined;
  History: undefined;
  Profile: undefined;
  Place: {filter: string | undefined},
  Chat: {bookID: string},
};

export type ProfileScreenRouteProp = RouteProp<RootStackParamList, "Profile">
export type ProfileNavigationProp = StackNavigationProp<RootStackParamList, "Profile">


export type PlaceScreenRouteProp = RouteProp<RootStackParamList, "Place">
export type PlaceNavigationProp = StackNavigationProp<RootStackParamList, "Place">


export type ChatScreenRouteProp = RouteProp<RootStackParamList, "Chat">
export type ChatNavigationProp = StackNavigationProp<RootStackParamList, "Chat">


const PassengerMainComponent: React.FC = (): JSX.Element => {

    const {isDark} = useContext<ThemeState>(ThemeContext)
    const theme = isDark ? CustomDarkTheme : CustomDefaultTheme
    const NavigationRef = useRef<any>(null)
    

    useEffect(()=>{
        const backAction = () => {
          const currentRoute = NavigationRef.current.getCurrentRoute()
          if(currentRoute.name === "Map"){
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


      const StackNav = (): JSX.Element => (
        <>
          <Stack.Navigator 
            initialRouteName={'Home'}
            headerMode={'screen'}
            screenOptions={{
              
            }}
          >
            <Stack.Screen name="Home" component={createDrawer} options={{headerShown: false}}/>
    
            <Stack.Screen name="History" component={createHistoryStack} options={{headerShown: false}}/>
            <Stack.Screen name="Profile" component={ProfileComponent} options={{headerShown: true , title: 'User Profile'}}/>
            <Stack.Screen name="Place" component={PlaceComponent} options={{title: ''}}/>
            <Stack.Screen name="Chat" component={ChatComponent} options={{title: ''}}/>
            <Stack.Screen name="BeaRider" component={BeaRiderComponent} options={{title: ''}}/>
            
          </Stack.Navigator>
        </>
      )

      const createHistoryStack = (): JSX.Element => (
        <>
          <Stack.Navigator
            initialRouteName="History"
          >
              <Stack.Screen name="History" component={HistoryComponent}/>
          </Stack.Navigator>
        </>
      )

      const createBookingStack = (): JSX.Element => (
        <>
        <Stack.Navigator>
              <Stack.Screen name="Place" component={PlaceComponent} options={{title: ''}}/>
        </Stack.Navigator>
        </>
      )
    

      const createDrawer = (): JSX.Element => (
        <>
          <Drawer.Navigator
            initialRouteName={'Map'}
            drawerType="front"
            drawerContent={props=><DrawerContent {...props}/>} 
            drawerPosition="left"
          >
              <Drawer.Screen name="Map" component={MapComponent} options={{title: 'Home'}}/>
          </Drawer.Navigator>
        </>
      )
    

    return (
        <>
        <PaperProvider theme={theme}>
            <NavigationContainer ref={NavigationRef} theme={theme}>
                    {StackNav()}
            </NavigationContainer>
        </PaperProvider>
        </>
    )
}

export default PassengerMainComponent