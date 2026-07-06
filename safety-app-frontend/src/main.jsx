import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import AuthProvider from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
   <GoogleOAuthProvider clientId="726611670186-05p3s728uopg8ua5c9qe0qsfsabl1ijs.apps.googleusercontent.com">
    <AuthProvider>
    <App />
    </AuthProvider>
  </GoogleOAuthProvider>
  
)

