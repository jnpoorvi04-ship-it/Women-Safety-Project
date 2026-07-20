import { createContext, useContext, useState } from "react";
import { connectSocket, disconnectSocket } from "../socket/socket";

const SocketContext = createContext();

export const SocketProvider = ({children}) => {
    const [socket, setSocket] = useState(null);

    const connect = (token) => {
        const connectedSocket = connectSocket(token);
        setSocket(connectedSocket);
        return connectedSocket;
    };

    const disconnect = () => {
        disconnectSocket();
        setSocket(null);
    }

    return(
        <SocketContext.Provider
            value={{
                socket,
                setSocket,
                connect,
                disconnect,
            }}
        >
            {children}
        </SocketContext.Provider>
    );
};

export const useSocketContext = () => {
    const context = useContext(SocketContext);

    if(!context){
        throw new Error(
            "useSocketContext must be used inside SocketProvider."
        );
    }
    return context;
};