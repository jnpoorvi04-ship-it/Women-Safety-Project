
import {Map, Marker} from "@vis.gl/react-google-maps";

const LiveTracking = () => {
    const position= {
        lat: 28.6139,
        lng: 77.2090,
    };

    return(
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
    );
};

export default LiveTracking;
