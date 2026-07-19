import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { connectSocket, getSocket, disconnectSocket } from "../socket/socket";
import axios from "axios";
import SOSButton from "../components/SOSButton";
import Countdown from "../components/Countdown";
import Profile from "./Profile";
import AlertModal from "../components/alerts/AlertModal";
import { useRef } from "react";
import LiveTracking from "../components/maps/LiveTracking";
import { useLocationContext } from "../context/LocationContext";
const Home = () => {
  const navigate = useNavigate();
  const [user,setUser] = useState(null);
  const [screen, setScreen] = useState("home");
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [incomingAlerts, setIncomingAlerts] = useState([]);
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    aadhaarCard: "",
    phone: "",
    emergencyContacts: [],
  });
  // const [liveLocation, setLiveLocation] = useState({});

  const {liveLocation} = useLocationContext();

  //Get latest user info after login
  useEffect(() => {
  const getUserInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please login again");
        navigate("/login");
        return;
      }

      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const loggedInUser = res.data.user;
      setUser(loggedInUser);

      setProfileData({
        name: loggedInUser.name || "",
        email: loggedInUser.email || "",
        aadhaarCard: loggedInUser.verificationDocument?.aadhaarCard || "",
        phone: loggedInUser.phone || "",
        emergencyContacts: loggedInUser.emergencyContacts?.length
          ? loggedInUser.emergencyContacts
          : [{ name: "", phone: "", email: "" }],
      });

      localStorage.setItem("user", JSON.stringify(loggedInUser));

      if (!loggedInUser.verified) {
        setShowVerifyModal(true);
      } else {
          setShowVerifyModal(false);
        }
    } catch (error) {
      alert("Session expired. Please login again.");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    } finally{
      setLoading(false);
    }
  };

  getUserInfo();
}, [navigate]);

const watchIdRef = useRef(null);

const liveLocSharing = (data) => {
  watchIdRef.current = startLiveLocationSharing(data.alertId);
  };

const stopLiveLocationSharing = () => {
    if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
    }
};

useEffect(() => {
  if (!user || !user.verified) return;

  const token = localStorage.getItem("token");
  const socket = connectSocket(token);

  if(!socket) return;

  socket.on("connect", () => {
    console.log("Socket Connected:", socket.id);
  });

  socket.on("connect_error", (err) => {
    console.log(err.message);
  });

  socket.on("alert-create", async(data) => {
    await liveLocSharing(data);
    setScreen("sosSent");
  });

  socket.on("alert-error", (err) => {
    alert(err.message);
    setScreen("home");
  });

  socket.on("incoming-alert", (data) => {
     setIncomingAlerts(prev => {
        // Prevent duplicate alerts
        if (prev.some(a => a._id === data._id)) return prev;

        return [data, ...prev];
    });
  });

  socket.on("location-update", (data)=> {
    const{
      alertId,
      latitude,
      longitude,
      updatedAt,
    } = data;

    setLiveLocation(prev => ({
      ...prev,
      [alertId]: {
        latitude,
        longitude,
        updatedAt,
      },
    }));
  });


  return () => {
    socket.off("connect");
    socket.off("connect_error");
    socket.off("alert-create");
    socket.off("alert-error");
    socket.off("incoming-alert");
    socket.off("location-update");

    disconnectSocket();
  };
}, [user]);

  const handleVerifyNow = () =>{
    navigate("/verify");
  };

  const startSOS = () => {
    setScreen("countdown");
  };

  const cancelSOS = () => {
    setScreen("home");
  };

  const sendSOS = () => {
    setScreen("sending");

  const socket = getSocket();
  
  if(!socket || !socket.connected){
    alert("Socket not connected");
    setScreen("home");
    return;
    }


    navigator.geolocation.getCurrentPosition(
      async (position) => {
          const { latitude, longitude } = position.coords;
          
          socket.emit("create-alert", {
            latitude,
            longitude,
          })
      },
      (error) => {
        console.error("Location error:", error);
        alert("Please allow location access to send SOS.");
        setScreen("home");
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );  
  }
  const handleOK = () => {
    setScreen("home");
  };

  const handleDismiss = (alertId) => {
    setIncomingAlerts(prev =>
        prev.filter(alert => alert._id !== alertId)
    );
};

  const startLiveLocationSharing = (alertId) => {

    const socket = getSocket();

    if (!socket || !socket.connected) return;

    const watchId = navigator.geolocation.watchPosition(

        (position) => {

            const { latitude, longitude } = position.coords;
            socket.emit("location-update", {
                alertId,
                latitude,
                longitude,
            });

        },

        (error) => {
            console.error(error);
        },

        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
        }

    );

    return watchId;
};


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4 relative">
      {user && (
        <div className="absolute top-5 left-5">
          <h2 className="text-xl font-semibold">Welcome, {user.name}</h2>
          <p className="text-gray-600">{user.email}</p>

          {!user.verified && (
            <p className="text-red-600 font-semibold mt-1">
              User is not verified till now
            </p>
          )}
        </div>
      )}
      {/* <div className="mt-6 h-[500px]">
    <LiveTracking location = {location} />
</div> */}
      <>
      {incomingAlerts && (
        <AlertModal
          alerts = {incomingAlerts}
          onDismiss = {handleDismiss}
        />
      )}
      </>

      {screen === "home" && <SOSButton onTrigger={startSOS} />}

      {screen === "countdown" && (
        <Countdown onComplete={sendSOS} onCancel={cancelSOS} />
      )}

      {screen === "sending" && (
        <h2 className="text-3xl font-semibold text-red-600">
          Sending SOS...
        </h2>
      )}

      {screen === "sosSent" && (
        <div className="text-center">
          <h2 className="text-3xl font-bold text-red-600 mb-6">
            🚨 SOS Sent
          </h2>

          <p className="text-gray-600 mb-6">
            Your emergency alert has been sent successfully.
          </p>

          <button
            onClick={handleOK}
            className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-green-700 transition"
          >
            OK
          </button>
        </div>
      )}

      <button
        onClick={() => setShowProfile(true)}
        className="absolute top-4 right-4 bg-white shadow px-4 py-2 rounded-full"
      >
        Profile
      </button>

      {showVerifyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white w-[90%] max-w-md rounded-2xl p-6 text-center shadow-xl">
            <h2 className="text-2xl font-bold text-red-600 mb-4">
              Profile Verification Required
            </h2>

            <p className="text-gray-700 mb-6">
              Your profile is not verified till now. Please verify your profile
              to continue using all safety features.
            </p>

            <button
              onClick={handleVerifyNow}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition"
            >
              Verify Now
            </button>
          </div>
        </div>
      )}
      <Profile
        showProfile={showProfile}
        setShowProfile={setShowProfile}
        profileData={profileData}
        setProfileData={setProfileData}
        setUser={setUser}
      />
    </div>
  );
};

export default Home;