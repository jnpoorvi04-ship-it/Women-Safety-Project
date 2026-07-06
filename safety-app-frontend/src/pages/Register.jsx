import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";

const Register = () => {
    const navigate = useNavigate();

    const [form,setForm] = useState({
        name: "",
        email: "",
        password:"",
    });

    const handleSubmit = async(e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.password) {
          alert("Please fill all fields");
          return;
        }
        try{
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`,form);
            alert("Registration successful");
            navigate("/login");
        } catch(error){
            console.error(error);
            alert(
              error.response?.data?.message ||
              "Registration failed"
            );
        }
    };
 return (
  <Modal title="Create Account ✨">
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Name"
        value={form.name}
        className="w-full mb-3 p-3 border rounded-lg"
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />

      <input
        type="email"
        placeholder="Email"
        value={form.email}
        className="w-full mb-3 p-3 border rounded-lg"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />

      <input
        type="password"
        placeholder="Password"
        value={form.password}
        className="w-full mb-4 p-3 border rounded-lg"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />

      <button className="w-full bg-pink-500 text-white py-3 rounded-lg hover:bg-pink-400 transition">
        Register
      </button>
      <p className="text-center mt-5 text-gray-600">
        Already have an account?{" "}
        <span
          onClick={() => navigate("/login")}
          className="text-pink-600 font-semibold cursor-pointer"
        >
          Login
        </span>
      </p>
    </form>
  </Modal>
);
}
export default Register;