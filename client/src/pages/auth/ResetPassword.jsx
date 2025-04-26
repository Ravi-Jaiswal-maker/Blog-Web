import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import { HiEye, HiEyeOff } from "react-icons/hi";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      const msg = "Passwords do not match";
      setError(msg);
      Swal.fire({
        icon: "error",
        title: "Oops!",
        text: msg,
      });
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await api.post(`/api/auth/reset-password/${token}`, {
        password,
        confirmPassword,
      });
      const msg = res.data.message || "Password updated successfully";
      setSuccess(msg);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: msg,
      });
      navigate("/admin/login");
    } catch (err) {
      const msg = err.response?.data?.message || "Reset failed";
      setError(msg);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center animated-dots-bg px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">
          Reset Password
        </h2>

        {error && <div className="text-red-600 text-sm mb-3">{error}</div>}
        {success && (
          <div className="text-green-600 text-sm mb-3">{success}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* New Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              New Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Enter your new password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
              >
                {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                placeholder="Confirm your new password"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600"
              >
                {showConfirmPassword ? (
                  <HiEyeOff size={20} />
                ) : (
                  <HiEye size={20} />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2.5 rounded-lg transition duration-200"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
