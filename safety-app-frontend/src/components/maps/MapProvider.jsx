import {APIProvider} from "@vis.gl/react-google-maps";

const MapProvider = ({ children }) => {
    console.log(import.meta.env.VITE_GOOGLE_MAPS_API_KEY);
    return (
        <APIProvider apiKey = {import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            {children}
        </APIProvider>
    );
};

export default MapProvider;