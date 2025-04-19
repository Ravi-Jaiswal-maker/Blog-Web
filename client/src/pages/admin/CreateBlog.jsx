import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import TiptapEditor from "../../components/TiptapEditor";

const CreateBlog = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: null,
  });
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
      const maxSizeMB = 2;

      if (!validTypes.includes(file.type)) {
        toast.error("Only JPG, JPEG, PNG, and WEBP formats are allowed.");
        return;
      }

      if (file.size > maxSizeMB * 1024 * 1024) {
        toast.error(`Image must be less than ${maxSizeMB}MB`);
        return;
      }

      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, content, image } = formData;

    if (!title || !content || !image) {
      toast.error("All fields including image are required.");
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append("title", title);
      data.append("content", content);
      data.append("image", image);

      const response = await api.post("/api/blogs", data, {
        headers: { "Content-Type": "multipart/form-data" },
        Authorization: `Bearer ${token}`,
      });

      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Blog Created!",
          text: "Your blog has been successfully posted.",
          confirmButtonColor: "#6366f1",
        }).then(() => {
          setFormData({ title: "", content: "", image: null });
          navigate("/admin/blogs");
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Oops!",
          text: "Something went wrong while creating the blog.",
        });
      }
    } catch (err) {
      console.error("Blog creation error:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Failed to create blog",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-3xl font-semibold text-gray-800">
        📝 Create New Blog
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium text-gray-700">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Content
          </label>
          <TiptapEditor
            content={formData.content}
            onContentChange={(content) =>
              setFormData((prev) => ({ ...prev, content }))
            }
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Image (JPG/PNG/WebP, max 2MB)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:py-2 file:px-4 file:border-0 file:rounded-lg file:bg-indigo-50 file:text-indigo-500 hover:file:bg-indigo-100"
            required
          />
          {formData.image && (
            <div className="mt-4">
              <p className="text-sm text-gray-600">Preview:</p>
              <img
                src={URL.createObjectURL(formData.image)}
                alt="Preview"
                className="w-32 h-32 mt-2 object-cover rounded border"
              />
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
        >
          {loading ? "Creating..." : "Create Blog"}
        </button>
      </form>
    </div>
  );
};

export default CreateBlog;
