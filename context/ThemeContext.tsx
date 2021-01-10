import React, {createContext,useState} from 'react'
import localStorage from 'react-native-sync-localstorage'

export interface ThemeState {
    isDark: boolean,
    toggleTheme: ()=> void,
    apiLoading: boolean,
    apiLoadingChange: (status: boolean)=> void,
}

const defaultValue: ThemeState = {
    isDark: false,
    toggleTheme: ()=> null,
    apiLoading: false,
    apiLoadingChange: ()=> null,
}

export const ThemeContext = createContext<ThemeState>(defaultValue)


const ThemeContextProvider: React.FC = (props)=>{

    const [isDark,setIsDark] = useState<boolean>(defaultValue.isDark)
    const [apiLoading,setApiLoading] = useState<boolean>(defaultValue.apiLoading)

    localStorage.getAllFromLocalStorage()
    .then((data: any) => {
    // Do Something after loading...
        if(data.Theme) setIsDark(data.Theme)
    })
    .catch((err: any) => {
    console.warn(err)
    })

    const toggleTheme = (): void =>{
        let newtheme = !isDark
        localStorage.setItem('Theme',newtheme)
        setIsDark(newtheme)
    }

    const apiLoadingChange = (status: boolean): void => {
        setApiLoading(status)
    }


    return (
        <>
            <ThemeContext.Provider
                value={{
                    isDark: isDark,
                    toggleTheme: toggleTheme,
                    apiLoading: apiLoading,
                    apiLoadingChange: apiLoadingChange
                }}
            >

                {props.children}

            </ThemeContext.Provider>
        </>
    )
}

export default ThemeContextProvider