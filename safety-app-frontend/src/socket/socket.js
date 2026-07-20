import { io } from "socket.io-client";

let socket = null;
export const connectSocket = (token) =>{
    if (socket?.connected) {
        return socket;
    }

    if(!socket){
        socket = io(import.meta.env.VITE_BACKEND_URL, {
            auth: {
                token,
            },
        });
    }
    return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
    if(socket){
        socket.disconnect();
        socket = null;
    }
};