import { useState, useContext } from "react";
import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Modal from "../components/Modal";

const Login = () => {
    const navigate = useNavigate();  
    const { setUser } = useContext(AuthContext);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleGoogleSuccess = async (credentialResponse) => {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/google`,
          {
            googleToken: credentialResponse.credential,
          }
        );
      
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));    
      setUser(res.data.user);
      navigate("/home");
      
      } catch (error) {
        console.error(error);
      }
    };

    const handleLogin = async (e) => {
      e.preventDefault();
      if (!email || !password) {
      alert("Please enter email and password");
      return;
      }

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
          { email, password }
        );
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(res.data.user);
        navigate("/home");

      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || "Login failed");
      }
    };

     return (
    <Modal title="Welcome !!">
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
        />

        <button
          type="submit"
          className="w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-600 transition"
        >
          Login
        </button>
      </form>

      <div className="my-5 flex items-center">
        <div className="flex-grow h-px bg-gray-300"></div>
        <span className="mx-3 text-gray-400">OR</span>
        <div className="flex-grow h-px bg-gray-300"></div>
      </div>

      <div className="flex justify-center">
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => console.log("Google Login Failed")}
        />
      </div>

      <p className="text-center mt-5 text-gray-600">
        Don't have an account?{" "}
        <span
          onClick={() => navigate("/register")}
          className="text-pink-600 font-semibold cursor-pointer"
        >
          Register
        </span>
      </p>
    </Modal>
  );
};

export default Login;
