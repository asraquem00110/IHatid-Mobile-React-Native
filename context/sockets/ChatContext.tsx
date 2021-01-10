import React, { createContext, useEffect, useRef, useState } from 'react'
import config from '../../helper/config'
import io from 'socket.io-client'
import { apiwrapper } from '../../api/wrapper'
import types from '../../api/types'

interface IMessage {
    userID: string,
    userName: string,
    message: string,
    createdAt: Date,
    isRead: boolean,
    _id: string,
    picture: string | null,
}


export interface IChatContextState {
    joinChatRoom: (bookID: string) => void,
    getMessage: (bookID: string) => void,
    messages: Array<IMessage>,
    sendMessage: (message: string, bookid: string , userid: string)=> void,
    flatlistref: any,
    unreadMessage: number,
    clearUnreadMessage: ()=> void,
}

const defaultValue: IChatContextState = {
    joinChatRoom: ()=> null,
    getMessage: ()=> null,
    messages: [],
    sendMessage: ()=> null,
    flatlistref: null,
    unreadMessage: 0,
    clearUnreadMessage: ()=> null,
}


export const ChatContext = createContext<IChatContextState>(defaultValue)

interface MessageReponse {
    _id: string,
    createdAt: Date,
    isRead: boolean,
    message: string,
    userID: {
        _id: string,
        contactno: string,
        email: string,
        fullname: string,
        picture: string
    }
}

const ChatContextProvider: React.FC = (props): JSX.Element => {

    const ref = useRef<SocketIOClient.Socket>()
    const [messages, setMessages] = useState<Array<IMessage>>(defaultValue.messages)
    const [unreadMessage, setUnreadMessage] = useState<number>(defaultValue.unreadMessage)
    const flatlistref = useRef(defaultValue.flatlistref)


    useEffect(()=>{
        let mounted: boolean = true

        if(mounted){
            const socket = io(`${config.BACKEND_URL}/chat`, { transports : ['websocket'] })

            socket.on('connect',()=>{
                console.log('connected')
            })
    
            socket.on('disconnect',()=>{
                console.log('disconnect')
            })
    
            socket.on('reconnect',()=>{
                console.log('reconnect')
            })

            socket.on('sendMessage', (msg: any)=>{
                setMessages((state)=>{
                    return [msg,...state]
                })
                setUnreadMessage((oldstate)=> oldstate+1)
            })
            
    
            ref.current = socket
        }

        return ()=>{
            mounted = false
        }

    },[])

    const joinChatRoom = (bookID: string): void =>{
        ref.current?.emit("JoinChatRoom", `Chat_${bookID}`)
    }

    const getMessage = async (bookid: string) => {
        let response: any = await apiwrapper.APICALL(`api/mobile/chat/getMessage/${bookid}`, null, types.GET)
        let messageResponse: Array<MessageReponse> = response.conversation
        let newmessages = messageResponse.map((msg)=> ({
            userID: msg.userID._id,
            userName: msg.userID.fullname,
            message: msg.message,
            createdAt: msg.createdAt,
            isRead: msg.isRead,
            _id: msg._id,
            picture: msg.userID.picture
        }))
        setMessages(newmessages.sort((a,b)=> a._id > b._id ? -1 : -1))
       
    }

    const clearUnreadMessage = (): void => setUnreadMessage(0)

    const sendMessage = async (message: string, bookid: string , userid: string) => {

        let result: any = await apiwrapper.APICALL('api/mobile/chat/sendMessage',{message: message, bookid: bookid, userid: userid}, types.POST)
        let messageResponse: MessageReponse = result.conversation[result.conversation.length - 1]
        let msg = {
            userID: messageResponse.userID._id,
            userName: messageResponse.userID.fullname,
            message: messageResponse.message,
            createdAt: messageResponse.createdAt,
            isRead: messageResponse.isRead,
            _id: messageResponse._id,
            picture: messageResponse.userID.picture
        }
        ref.current?.emit("sendMessage", {room: `Chat_${bookid}` , msg: msg})
    }
    

    return (
        <>
            <ChatContext.Provider value={{
                joinChatRoom: joinChatRoom,
                getMessage: getMessage,
                messages: messages,
                sendMessage: sendMessage,
                flatlistref: flatlistref,
                unreadMessage: unreadMessage,
                clearUnreadMessage: clearUnreadMessage,
            }}>
                    {props.children}
            </ChatContext.Provider>
        </>
    )
}

export default ChatContextProvider