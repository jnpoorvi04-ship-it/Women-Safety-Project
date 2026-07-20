import { createContext, useContext, useState, useEffect } from "react";
import { getSocket } from "../socket/socket";

const LocationContext = createContext();

export const LocationProvider = ({children}) => {

    useEffect(() => {
        const socket = getSocket();
        if(!socket) return;

        const handleLocationUpdate = (data) => {
            console.log("Context received:", data);
            updateLocation(data);
        };

        socket.on("location-update", handleLocationUpdate);

        return()=> {
            socket.off("location-update", handleLocationUpdate);
        };
    },[]);

    const [liveLocations, setLiveLocations] = useState({});

    const updateLocation = ({
        alertId,
        latitude,
        longitude,
        updatedAt,
    }) => {
        setLiveLocations(prev => ({
            ...prev,
            [alertid]: {
                location: {
                    latitude,
                    longitude,
                },
                updatedAt,
            },
        }));
    };

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