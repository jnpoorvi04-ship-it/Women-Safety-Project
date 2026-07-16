import { getAuthenticatedUser } from "../utils/auth.js";


export const authSocket = async (socket, next) => {
    try {
        const token = socket.handshake.auth?.token;
        if (!token) {
            return next(new Error("Authentication required"));
        }

        socket.user = await getAuthenticatedUser(token);

        
        next();
    } catch (error) {
        next(new Error(error.message));
    }
};