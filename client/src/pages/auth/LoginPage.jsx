import React from "react";
import { useNavigate } from "react-router-dom";
import Login from "../../components/Auth/Login";

const LoginPage = () => {
  const navigate = useNavigate();

  return (
    <div className="animated-dots-bg">
      <button
        onClick={() => navigate("/")}
        className="fixed top-4 right-4 z-50 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-full shadow-lg transition-colors duration-300 flex items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 mr-2"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9a1 1 0 011-1h3a1 1 0 110 2h-3a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
        Back to Blogs
      </button>

      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
            Admin Login
          </h2>
          <Login />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
