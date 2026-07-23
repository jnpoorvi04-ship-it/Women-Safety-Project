import { createContext, useContext, useState, useEffect } from "react";
import { useSocketContext } from "./SocketContext";

const LocationContext = createContext();

export const LocationProvider = ({children}) => {

    const {socket} = useSocketContext();

     const [liveLocations, setLiveLocations] = useState({});

    const updateLocation = ({
        alertId,
        location: {
            longitude,
            latitude,
        },
        updatedAt,
    }) => {
        setLiveLocations(prev => ({
            ...prev,
            [alertId]: {
                location: {
                    latitude,
                    longitude,
                },
                updatedAt,
            },
        }));
    };

    useEffect(() => {
        if(!socket){
            return;
        }

        socket.on("location-update", updateLocation);

        return()=> {
            socket.off("location-update", updateLocation);
        };
    },[socket]);

    const removeLocation = (alertId) => {
        setLiveLocations(prev => {
            const updated = {...prev};
            delete updated[alertId];
            return updated;
        });
    };

    return(
        <LocationContext.Provider 
            value = {{
                liveLocations,
                updateLocation,
                removeLocation,
            }}
        >
            {children}
        </LocationContext.Provider>
    );
};

export const useLocationContext = () => {
    const context = useContext(LocationContext);

    if(!context){
        throw new Error(
             "useLocationContext must be used inside a LocationProvider."
        );
    }
    return context;
};