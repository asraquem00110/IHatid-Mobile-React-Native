import React, { useCallback, useContext, useEffect, useRef, useState } from 'react'
import {TextInput, Text, View , StyleSheet, FlatList , Dimensions , TouchableOpacity, Alert, ListRenderItem , Image} from 'react-native'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/reducers'
import {useRoute} from '@react-navigation/native'
import { ChatContext, IChatContextState } from '../../context/sockets/ChatContext'
import { formatBdayDate , format12Hour } from '../../helper/helper'

const {width, height} = Dimensions.get("window")

interface IMessage {
    userID: string,
    userName: string,
    message: string,
    createdAt: Date,
    isRead: boolean,
    _id: string,
    picture: string | null,
}


const ChatComponent: React.FC = (): JSX.Element => {

    const routehook = useRoute<any>()
    const myinfo = useSelector((state:RootState)=> state.auth.userinfo)
    const [message,setMessage] = useState<string>("")

    const {sendMessage , messages , getMessage , flatlistref , clearUnreadMessage , unreadMessage} = useContext<IChatContextState>(ChatContext)

    useEffect(()=>{
        getMessage(routehook.params.bookID)
    },[])

    useEffect(()=>{
        clearUnreadMessage()
    },[unreadMessage])

    const renderItem: ListRenderItem<IMessage> = ({item})=> (
        <>
            {
                item.userID == myinfo._id
                ? <View style={styles.messageSent}>
                          <Text style={styles.messageText}>{item.message}</Text>
                          <Text style={styles.messageTime}>{formatBdayDate(item.createdAt)} {format12Hour(item.createdAt)}</Text>
                  </View>
                : <View style={styles.messageReply}>
                        <Image
                            source={item.picture ? {uri: item.picture} : require('../../assets/img/user.png')}
                            style={{width: 50,height: 50,marginRight: 10,borderRadius: 50}}
                        />
                        
                        <View style={styles.messageReplyChat}>
                            <Text style={styles.messageText}>{item.message}</Text>
                            <Text style={styles.messageTime}>{formatBdayDate(item.createdAt)}  {format12Hour(item.createdAt)}</Text>
                        </View>
                 </View>
            }
        </>
    )


    return (
        <>
            <View style={styles.container}>
                <View style={styles.messages}>
                    <FlatList<IMessage>
                           inverted 
                           data={messages}
                           renderItem={renderItem}
                           keyExtractor={(item)=> `${item._id}_${item.userID}`}
                           extraData={messages}    
                           ref={flatlistref}
                    >
                    </FlatList>
                </View>

                <View style={styles.writemsg}>
                    <TextInput
                    value={message}
                    onChangeText={(text)=>setMessage(text)}
                    autoFocus={true}
                    multiline={true}
                    placeholder="Write Message here ..."
                    style={styles.textinput}>

                    </TextInput>
                    <TouchableOpacity disabled={message.length == 0} onPress={()=>{sendMessage(message,routehook.params.bookID,myinfo._id); setMessage("")}} style={styles.sendbtn}>
                          <Text style={{fontWeight: 'bold',color: "white",fontSize: 16}}>Send</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    messages: {
        flex: 1,
        flexShrink: 1,
        flexGrow: 1,
        backgroundColor: "white",
        padding: 5,
    },
    writemsg: {
        height: height * 0.10,
        width: width,
        backgroundColor: "#e8e8e8",
        flexDirection: "row",
    },
    textinput: {
        flex: 1,
        flexGrow: 1,
        flexShrink: 1,
    },
    sendbtn: {
        width: width * 0.25,
        backgroundColor: "dimgray",
        justifyContent: "center",
        alignItems: "center"
    },
    messageSent: {
        flex: 1,
        justifyContent: 'flex-end',
        marginLeft: 65,
        marginRight: 5,
        marginTop: 5,
        marginBottom: 5,
        padding: 20,
        backgroundColor: "#d6eef8",
        borderRadius: 10,
    },
    messageReply: {
        flex: 1,
        flexDirection: "row",
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginRight: 5,
        marginLeft: 5,
        marginTop: 5,
        marginBottom: 5,
    },
    messageReplyChat: {
        backgroundColor: "#e8e8e8",
        borderRadius: 10,
        padding: 20,
        flex: 1,
    }, 
    messageText: {
        color: "black",
    },
    messageTime: {
        fontSize: 10,
        alignSelf: 'flex-end',
        marginTop: 10,
    }
})

export default ChatComponent