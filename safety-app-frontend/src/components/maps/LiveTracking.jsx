
import {Map, Marker} from "@vis.gl/react-google-maps";

const LiveTracking = ({location}) => {
    const position= {
        lat: location.latitude,
        lng: location.longitude,
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
