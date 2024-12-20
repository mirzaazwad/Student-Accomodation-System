import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../utils/api";
// import "../styles.css";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/auth/login", { email, password });
      console.log("Login successful:", response.data);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error logging in:", error.response.data);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
        <form className="space-y-4">
        <input type="email" placeholder="Email Address" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input type="password" placeholder="Password" required className= "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
         >Login</button>
        </form>
      </div>
      
    </div>
  );
};

export default Login;