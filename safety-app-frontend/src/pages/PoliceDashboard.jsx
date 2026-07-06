import { useEffect, useState } from "react";
import socket from "../services/socket";

const PoliceDashboard = () => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    socket.on("receive_sos", (data) => {
       console.log("Alert received on dashboard:", data);
      setAlerts((prev) => [data, ...prev]);
    });

    return () => {
      socket.off("receive_sos");
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">🚓 Police Dashboard</h1>

      {alerts.length === 0 ? (
        <p className="text-gray-600">No SOS alerts yet.</p>
      ) : (
        <div className="space-y-4">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className="bg-white border-l-4 border-red-600 p-4 rounded-lg shadow"
            >
              <h2 className="text-xl font-bold text-red-600">
                🚨 {alert.message}
              </h2>
              <p>User: {alert.name}</p>
              <p>Latitude: {alert.lat}</p>
              <p>Longitude: {alert.lng}</p>
              <p>Time: {alert.time}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PoliceDashboard;