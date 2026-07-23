import {useParams} from "react-router-dom";
import { useLocationContext } from "../context/LocationContext";
import LiveTracking from "../components/maps/LiveTracking";

const AlertTracker = () => {
    const {alertId} = useParams();
    const {liveLocations} = useLocationContext();
    const currentLocation = liveLocations[alertId];

    if(!currentLocation){
        return(
            <div className="flex justify-center items-center h-screen">
                Waiting for live location...
            </div>
        );
    }

    const handleNavigate = () => {
        const {latitude, longitude} = location;
        const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}&travelmode=driving`;
        window.open(url, "_blank");
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            <h1 className="text-3xl font-bold mb-2">
                Live SOS Tracking
            </h1>

            <div className="rounded-xl overflow-hidden shadow-lg">
                <LiveTracking location={currentLocation.location} />
            </div>
            
        </div>
    );
};

export default AlertTracker;