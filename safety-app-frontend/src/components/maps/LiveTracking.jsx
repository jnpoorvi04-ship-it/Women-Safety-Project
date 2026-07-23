
import {Map, Marker} from "@vis.gl/react-google-maps";

const LiveTracking = ({location}) => {
    const position= {
        lat: location.latitude,
        lng: location.longitude,
    };

    const handleNavigate = () => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${location.latitude},${location.longitude}&travelmode=driving`;

        window.open(url, "_blank");
    };

    return(
        <>
        <Map 
            defaultCenter = {position}
            defaultZoom = {15}
            style={{
                width: "100%",
                height:"500px",
            }}
        >
            <Marker position={position}/>
        </Map>

        <div className="mt-4 flex items-center justify-between rounded-lg bg-gray-100 px-4 py-3">
            <span className="text-sm font-medium text-gray-600">
                Last Updated
            </span>

            <span className="text-sm font-semibold text-gray-900">
                {location.updatedAt
                    ? new Date(location.updatedAt).toLocaleTimeString()
                    : "--"}
            </span>
        </div>
        
        <button
            onClick={handleNavigate}
            className="mt-5 w-full flex items-center justify-center gap-3 rounded-xl bg-blue-600 px-6 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-200 hover:bg-blue-700 hover:shadow-xl active:scale-95"
            >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-6 w-6"
            >
                <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.69 18.933l.513-1.283a6 6 0 013.154-3.154l1.283-.513a.75.75 0 000-1.396l-9-3.6a.75.75 0 00-.98.98l3.6 9a.75.75 0 001.43-.034z"
                />
            </svg>

            Navigate with Google Maps
            </button>
        </>
    );
};

export default LiveTracking;
