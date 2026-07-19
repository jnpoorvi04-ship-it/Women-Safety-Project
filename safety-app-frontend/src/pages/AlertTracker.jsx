import {useParams} from "react-router-dom";
import LiveTracking from "../components/maps/LiveTracking";

const AlertTracker = () => {
    const {alertId} = useParams();
    console.log(alertId);
    const location = {
        latitude: 28.6139,
        longitude: 77.2090,
    };

    return (
        <div className="min-h-screen bg-gray-100 p-6">

            <h1 className="text-3xl font-bold mb-2">
                Live SOS Tracking
            </h1>

            <div className="rounded-xl overflow-hidden shadow-lg">
                <LiveTracking location={location} />
            </div>

        </div>
    );
};

export default AlertTracker;