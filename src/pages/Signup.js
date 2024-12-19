import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { handleError, handleSuccess } from "../utils";

// Ensure BASE_URL is defined or provide a default fallback
const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

function Signup() {
  const [signupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  // Update state on input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupInfo((prevState) => ({ ...prevState, [name]: value }));
  };

  // Handle form submission
  const handleSignup = async (e) => {
    e.preventDefault();

    const { name, email, password } = signupInfo;

    // Validate fields
    if (!name || !email || !password) {
      return handleError("Name, email, and password are required.");
    }

    try {
      const url = `${BASE_URL}/auth/signup`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(signupInfo),
      });

      const result = await response.json();

      const { success, message, error } = result;

      if (success) {
        handleSuccess(message || "Signup successful!");
        setTimeout(() => navigate("/login"), 1000);
      } else if (error) {
        // Use error details if available, otherwise use a generic message
        const details = error?.details?.[0]?.message || "Something went wrong.";
        handleError(details);
      } else {
        handleError(message || "Signup failed.");
      }
    } catch (err) {
      handleError("An error occurred. Please try again later.");
      console.error("Signup Error:", err);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Signup</h1>
      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label htmlFor="name" className="block mb-1 font-medium">
            Name
          </label>
          <input
            onChange={handleChange}
            type="text"
            name="name"
            id="name"
            placeholder="Enter your name..."
            value={signupInfo.name}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="email" className="block mb-1 font-medium">
            Email
          </label>
          <input
            onChange={handleChange}
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email..."
            value={signupInfo.email}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-1 font-medium">
            Password
          </label>
          <input
            onChange={handleChange}
            type="password"
            name="password"
            id="password"
            placeholder="Enter your password..."
            value={signupInfo.password}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Signup
        </button>
        <span className="block mt-4 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </span>
      </form>
      <ToastContainer />
    </div>
  );
}

export default Signup;
