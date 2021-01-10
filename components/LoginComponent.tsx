import React , {lazy} from 'react'
import {NavigationContainer, RouteProp} from '@react-navigation/native'
import {createStackNavigator , StackNavigationProp} from '@react-navigation/stack'


const Login = lazy(()=>import('./LoginScreens/Login'))
const Register = lazy(()=>import('./LoginScreens/Register'))
const ConfirmationCode = lazy(()=>import('./LoginScreens/ConfirmationCode'))
const stackLogin = createStackNavigator()

export type RootStackParamList = {
    login: undefined;
    registerNo: {oauth: boolean, type?: string};
    confirmationNo: {mobileno: string, oauth: boolean , type?: string};
 };

 export type ConfirmationScreenRouteProp = RouteProp<RootStackParamList, 'confirmationNo'>
 export type ConfirmationNavigationProp = StackNavigationProp<RootStackParamList,'confirmationNo'>;

 export type RegisterScreenRouteProp = RouteProp<RootStackParamList, 'registerNo'>


const LoginComponent: React.FC = (): JSX.Element => {

    return (
        <>
            <NavigationContainer>
                <stackLogin.Navigator>
                     <stackLogin.Screen name="login" component={Login} options={{headerShown: false }}/>
                     <stackLogin.Screen name="registerNo" component={Register} options={{title: ''}}/>
                     <stackLogin.Screen name="confirmationNo" component={ConfirmationCode} options={{title: ''}} />
                </stackLogin.Navigator>
            </NavigationContainer>
        </>
    )
}



export default LoginComponent