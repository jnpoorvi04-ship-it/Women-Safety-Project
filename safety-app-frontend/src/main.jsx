import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import AuthProvider from "./context/AuthContext";
import MapProvider from "./components/maps/MapProvider.jsx";
import { LocationProvider } from "./context/LocationContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
   <React.StrictMode>
    <BrowserRouter>
      <GoogleOAuthProvider clientId="726611670186-05p3s728uopg8ua5c9qe0qsfsabl1ijs.apps.googleusercontent.com">
        <AuthProvider>
          <MapProvider>
            <LocationProvider>
              <App />
            </LocationProvider>
          </MapProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
   </BrowserRouter>
  </React.StrictMode>
 
)

