import React, { useState, useEffect } from "react";
import api from "../../api";
import { toast } from "react-hot-toast";
import SuccessBanner from "../../components/common/SuccessBanner";

const Profile = () => {
  const [admin, setAdmin] = useState({
    name: "",
    email: "",
    avatar: "",
  });
  const [formData, setFormData] = useState({
    name: "",
    password: "",
    avatar: null,
  });
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get("/api/auth/profile");
        setAdmin(res.data);
        setFormData((prev) => ({ ...prev, name: res.data.name }));
      } catch (err) {
        toast.error("Failed to load profile");
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, avatar: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      if (formData.password) data.append("password", formData.password);
      if (formData.avatar) data.append("avatar", formData.avatar);

      const res = await api.put("/api/auth/update-profile", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
      setAdmin(res.data.admin);
      setFormData((prev) => ({ ...prev, password: "", avatar: null }));
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold">Profile Settings</h2>

      {showSuccess && <SuccessBanner message="Profile updated successfully!" />}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Avatar Preview */}
        {admin.avatar?.url && (
          <img
            src={admin.avatar.url}
            alt="Avatar"
            className="w-24 h-24 rounded-full object-cover"
          />
        )}

        <div>
          <label className="block font-medium mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">
            New Password (optional)
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Avatar (optional)</label>
          <input type="file" accept="image/*" onChange={handleFileChange} />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
