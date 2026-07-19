import { createContext, useContext, useState } from "react";

const LocationContext = createContext();

export const LocationProvider = ({children}) => {
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
                lattude,
                longitude,
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