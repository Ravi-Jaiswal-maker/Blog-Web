import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";

const AdminBlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [activeBlog, setActiveBlog] = useState(null);
  const limit = 6;

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/api/blogs?page=${page}&limit=${limit}`);
      setBlogs(res.data.blogs || []);
      setPages(res.data.pages || 1);
    } catch (err) {
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won’t be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/api/blogs/${id}`);
        toast.success("Blog deleted successfully!");
        fetchBlogs();

        Swal.fire("Deleted!", "Your blog has been deleted.", "success");
      } catch (err) {
        toast.error("Failed to delete blog");
        Swal.fire("Error!", "Something went wrong.", "error");
      }
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [page]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Manage Blogs</h1>

      {loading ? (
        <div className="flex justify-center items-center py-24">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-indigo-600 border-opacity-50"></div>
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-24 text-gray-500">No blogs found.</div>
      ) : (
        <>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-white rounded-xl border shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                {blog?.image?.url ? (
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={blog.image.url}
                      alt={blog.title || "Blog"}
                      onError={(e) => (e.target.style.display = "none")}
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  </div>
                ) : (
                  <div className="h-48 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">
                    No Image Available
                  </div>
                )}

                <div className="p-5">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                    {blog.title}
                  </h2>
                  <div className="text-sm text-gray-600 mb-4">
                    <p>
                      {blog.content?.replace(/<[^>]+>/g, "").slice(0, 100) ||
                        "No content"}
                      ...
                    </p>
                    {blog.content?.length > 100 && (
                      <button
                        onClick={() => setActiveBlog(blog)}
                        className="text-indigo-600 hover:underline mt-1 block"
                      >
                        View More
                      </button>
                    )}
                  </div>

                  <div className="flex justify-between items-center text-sm font-medium">
                    <Link
                      to={`/admin/blogs/edit/${blog._id}`}
                      className="text-indigo-600 hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center mt-10 items-center gap-2 flex-wrap">
            <button
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded border text-sm font-medium text-indigo-600 hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-4 py-2 rounded border text-sm font-medium ${
                  page === p
                    ? "bg-indigo-600 text-white"
                    : "text-indigo-600 hover:bg-indigo-100"
                }`}
              >
                {p}
              </button>
            ))}

            <button
              onClick={() => setPage((prev) => Math.min(prev + 1, pages))}
              disabled={page === pages}
              className="px-4 py-2 rounded border text-sm font-medium text-indigo-600 hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* View More Modal */}
      {activeBlog && (
        <div
          className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
          onClick={() => setActiveBlog(null)}
        >
          <div
            className="bg-white max-w-xl w-full rounded-lg shadow-lg p-6 relative max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveBlog(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-2xl"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">
              {activeBlog.title}
            </h2>
            {activeBlog?.image?.url && (
              <img
                src={activeBlog.image.url}
                alt={activeBlog.title}
                className="w-full h-60 object-cover rounded mb-4"
              />
            )}
            <p className="text-gray-700 whitespace-pre-wrap">
              {activeBlog.content?.replace(/<[^>]+>/g, "")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBlogList;
