import { useState } from "react";
import api from "../../api";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/api/auth/forgot-password", { email });
      const msg = res.data.message || "Password reset email sent.";

      Swal.fire({
        icon: "success",
        title: "Link Sent!",
        text: msg,
        confirmButtonColor: "#6366f1",
      });

      setEmail(""); // clear input on success
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong";

      Swal.fire({
        icon: "error",
        title: "Error!",
        text: msg,
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animated-dots-bg">
      {/* Back Button */}
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

      {/* Forgot Password Form */}
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
          <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
            Forgot Password
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-1 text-gray-700"
              >
                Registered Email
              </label>
              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition duration-200"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
