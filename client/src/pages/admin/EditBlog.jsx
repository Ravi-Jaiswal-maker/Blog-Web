import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api";
import { toast } from "react-hot-toast";
import Swal from "sweetalert2";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",
    onUpdate: ({ editor }) => {
      setFormData((prev) => ({
        ...prev,
        content: editor.getHTML(),
      }));
    },
  });

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await api.get(`/api/blogs/id/${id}`);
        const { title, content, image } = res.data;

        setFormData({ title, content, image: null });
        setPreview(image?.url || null);

        // Set TipTap editor content after loading blog
        if (editor) {
          editor.commands.setContent(content || "");
        }
      } catch (err) {
        toast.error("Failed to load blog");
        navigate("/admin/blogs");
      }
    };
    fetchBlog();
  }, [id, navigate, editor]);

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
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("content", formData.content);
      if (formData.image) data.append("image", formData.image);

      await api.put(`/api/blogs/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Blog updated successfully.",
        confirmButtonColor: "#6366f1",
      }).then(() => {
        navigate("/admin/blogs");
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: err.response?.data?.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-3xl font-semibold text-gray-800">✏️ Edit Blog</h2>

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
          <div className="border rounded-lg px-3 py-2 min-h-[150px]">
            {editor && <EditorContent editor={editor} />}
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Update Image (optional)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:py-2 file:px-4 file:border-0 file:rounded-lg file:bg-indigo-50 file:text-indigo-500 hover:file:bg-indigo-100"
          />
          {preview && (
            <div className="mt-4">
              <p className="text-sm text-gray-600">Preview:</p>
              <img
                src={preview}
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
          {loading ? "Updating..." : "Update Blog"}
        </button>
      </form>
    </div>
  );
};

export default EditBlog;
