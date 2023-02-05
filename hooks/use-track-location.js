import { useContext, useState } from "react";
import { ACTION_TYPES, StoreContext } from "../store/store-context";

const useTrackLocation = () => {
    const [locationErrorMsg, setLocationErrorMsg] = useState("");
    //const [latLng, setLatLng] = useState("");
    const [isFindingLocation, setIsFindingLocation] = useState(false);

    const {dispatch} = useContext(StoreContext);

    const success = (position) => {
        setIsFindingLocation(false);
        dispatch({
            type: ACTION_TYPES.SET_LAT_LNG,
            payload: {
                latLng: `${position.coords.latitude},${position.coords.longitude}`
            }
        })
        //setLatLng(`${position.coords.latitude},${position.coords.longitude}`);
        setLocationErrorMsg("");
    };

    const error = () => {
        setIsFindingLocation(false);
        setLocationErrorMsg('Unable to retrieve your location');
    };

    const handleTrackLocation = () => {
        if (!navigator.geolocation) {
            setIsFindingLocation(false);
            setLocationErrorMsg('Geolocation is not supported by your browser');
        } else {
            setIsFindingLocation(true);
            //setLocationErrorMsg('Locating…');
            navigator.geolocation.getCurrentPosition(success, error);
        }
    }

    return {
        //latLng,
        handleTrackLocation,
        isFindingLocation,
        locationErrorMsg
    }
}

export default useTrackLocation;