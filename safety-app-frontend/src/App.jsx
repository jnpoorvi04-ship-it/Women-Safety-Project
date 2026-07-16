
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import PoliceDashboard from "./pages/PoliceDashboard";
import Verify from "./pages/Verify";

function App() {

  return (
      <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/police-dashboard" element={<PoliceDashboard />} />
        <Route path="/verify" element={<Verify />} />

        
      <Route path="/home"
      element={
      <ProtectedRoute>
      <Home/>
      </ProtectedRoute>
      }
      />
      </Routes>
  )
}

export default App;
