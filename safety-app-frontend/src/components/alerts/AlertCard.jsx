export default function AlertCard({ alert, onDismiss }) {
    return (
        <div className="bg-white rounded-xl shadow-xl border-l-4 border-red-600 p-4 w-80">

            <h3 className="text-red-600 font-bold text-lg">
                🚨 Emergency Alert
            </h3>

            <p className="mt-2">
                <strong>{alert.senderName}</strong> needs help.
            </p>

            <p className="text-sm mt-2">
                Latitude: {alert.lat}
            </p>

            <p className="text-sm">
                Longitude: {alert.lng}
            </p>

            <button onClick={() => handleViewLocation(alert._id)}>
                View Location
            </button>

            <button
                className="bg-red-600 text-white px-4 py-2 rounded mt-4 w-full"
                onClick={() => onDismiss(alert._id)}
            >
                Dismiss
            </button>

        </div>
    );
}