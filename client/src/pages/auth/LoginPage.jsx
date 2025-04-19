import React from "react";
import Login from "../../components/Auth/Login";

const LoginPage = () => {
  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Admin Login
        </h2>
        <Login />
      </div>
    </div>
  );
};

export default LoginPage;
