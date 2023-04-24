import {
    GoogleMap,
    InfoWindow,
    Marker,
    useJsApiLoader,
} from "@react-google-maps/api";
import { useCallback, useEffect, useState } from "react";
import { Post } from "../Interface";
const containerStyle = {
    width: "100%",
    height: "100%",
};

const center = {
    lat: 52.344,
    lng: -100.0,
};


type Props = {
    data: Post[]
}

const Map = ({ data }: Props) => {
    const [map, setMap] = useState(null);
    const [activeMarker, setActiveMarker] = useState<any>(null);
    const [markers, setMarkers] = useState<Post[]>([]);
    const { isLoaded } = useJsApiLoader({
        id: "google-map-script",
        googleMapsApiKey: `${process.env.NEXT_PUBLIC_MAP_KEY}`,
    });
    const onLoad = useCallback(function callback(map: any) {
        setMap(map);
    }, []);
    const onUnmount = useCallback(function callback(map: any) {
        setMap(null);
    }, []);
    const onMarkerClick = (marker: any) => {
        setActiveMarker(marker);
    };
    const onInfoWindowClose = () => {
        setActiveMarker(null);
    };

    const groupByCoords = (arr: any) => {
        const result: any = {};
        arr.forEach((item: any) => {
            const coords: any = [item.lat, item.lng];
            if (result[coords]) {
                result[coords].push(item);
            } else {
                result[coords] = [item];
            }
        });
        return result;
    };

    const groupedArr = () => {
        const arr: any = [];
        Object.entries(groupByCoords(data)).forEach((key) => {
            arr.push({
                lat: key[0].split(",")[0],
                lng: key[0].split(",")[1],
                data: key[1],
            });
        });
        return arr;
    };
    const riskCollor = (el: any) => {
        if (Number(el.risk_rating) <= 0.39) {
            return "rgb(79, 163, 93)";
        }
        if (Number(el.risk_rating) >= 0.4 && Number(el.risk_rating) <= 0.49) {
            return "rgb(107, 211, 80)";
        }
        if (Number(el.risk_rating) >= 0.5 && Number(el.risk_rating) <= 0.59) {
            return "rgb(149, 236, 131)";
        }
        if (Number(el.risk_rating) >= 0.6 && Number(el.risk_rating) <= 0.69) {
            return "rgb(240, 179, 84)";
        }
        if (Number(el.risk_rating) >= 0.7 && Number(el.risk_rating) <= 0.79) {
            return "rgb(226, 89, 45)";
        }
        if (Number(el.risk_rating) > 0.8) {
            return "rgb(173, 65, 50)";
        }
    };
    useEffect(() => {
        if (data) {
            setMarkers(groupedArr());
        }
    }, [data]);
    return (
        <div className="content">
            {isLoaded && (
                <GoogleMap
                    mapContainerStyle={containerStyle}
                    center={center}
                    zoom={4}
                    onLoad={onLoad}
                    onClick={() => {
                        setActiveMarker(null)
                    }}
                >

                    {markers.map((marker: any, index: number) => (
                        <Marker
                            key={index}
                            position={{ lat: Number(marker.lat), lng: Number(marker.lng) }}
                            onClick={(e) => {
                                setActiveMarker(index);
                            }}
                        >
                            {activeMarker === index && (
                                <InfoWindow onCloseClick={onInfoWindowClose}>
                                    <div className="popup">
                                        <ul className="list">
                                            {marker?.data?.map((el: any, index: number) => {
                                                const rf = Object.entries(
                                                    el.risk_factors
                                                ).map(([risk, probability]) => ({
                                                    risk,
                                                    probability,
                                                }));

                                                return (
                                                    <li
                                                        key={index + 100}
                                                        style={{
                                                            background: `${riskCollor(el)}`,
                                                        }}
                                                    >
                                                        <h2>{el.asset_name}</h2>
                                                        <p>Buisness Category : {el.business_category}</p>
                                                        <div>
                                                            Risks:
                                                            <ul>
                                                                {rf.map((r) => {
                                                                    return (
                                                                        <li key={r.risk}>
                                                                            <p>
                                                                                {r.risk} : {Number(r.probability).toFixed(2)}
                                                                            </p>
                                                                        </li>
                                                                    );
                                                                })}
                                                            </ul>
                                                        </div>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                </InfoWindow>
                            )}
                        </Marker>
                    ))}
                </GoogleMap>
            )}
        </div>
    );
}

export default Map