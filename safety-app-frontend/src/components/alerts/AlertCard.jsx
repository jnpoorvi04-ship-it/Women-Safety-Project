import { useNavigate } from "react-router-dom";

export default function AlertCard({ alert, onDismiss }) {
    const navigate = useNavigate();
    return (
        <div className="bg-white rounded-xl shadow-xl border-l-4 border-red-600 p-4 w-80">

            <h3 className="text-red-600 font-bold text-lg">
                🚨 Emergency Alert
            </h3>

            <p className="mt-2">
                <strong>{alert.senderName}</strong> needs help.
            </p>

            <button onClick={() => navigate(`/track/${alert._id}`)}
                className="w-full mt-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold py-2.5 rounded-lg shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                Track Live Location
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