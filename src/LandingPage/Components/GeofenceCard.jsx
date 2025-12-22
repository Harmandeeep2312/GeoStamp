import { GeoFenceVisualizer } from "./GeoFenceVisualizer";

function GeoFenceCard({ event }) {
    return (
        <div className="card geofence-card">
        <GeoFenceVisualizer
            lat={event.latitude}
            lng={event.longitude}
            radius={event.radius}
        />
        </div>
    );
}

export default GeoFenceCard;
