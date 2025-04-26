import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api";
import { format } from "date-fns";
import { toast } from "react-hot-toast";

const PublicBlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchBlogs = async (currentPage) => {
    try {
      setIsLoading(true);
      const res = await api.get(`/api/blogs?page=${currentPage}`);
      setBlogs(res.data.blogs);
      setTotalPages(res.data.pages);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch blogs");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs(page);
  }, [page]);

  const handleAdminLogin = () => {
    navigate("/admin/login");
  };

  if (isLoading && blogs.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse"
            >
              <div className="bg-gray-200 h-48 w-full"></div>
              <div className="p-6">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  <div className="h-3 bg-gray-200 rounded w-4/6"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animated-dots-bg min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
        <button
          onClick={handleAdminLogin}
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
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
              clipRule="evenodd"
            />
          </svg>
          Admin Login
        </button>

        <div className="animated-dots py-16">
          <div className="text-center px-4">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
              Dive Into <span className="text-indigo-600">Brilliant Ideas</span>{" "}
              & <span className="text-indigo-600">Fresh Perspectives</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore thought-provoking articles, creative inspiration, and
              professional insights curated just for you.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-500 ease-in-out hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02]"
            >
              {blog.image?.url && (
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={blog.image.url}
                    alt={blog.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              )}

              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <span>{format(new Date(blog.createdAt), "dd MMM yyyy")}</span>
                  <span className="mx-2">•</span>
                  <span className="font-medium text-indigo-600">
                    {blog.createdBy}
                  </span>
                </div>

                <Link to={`/blogs/${blog.slug}`}>
                  <h2 className="text-xl font-bold text-gray-900 mb-3 hover:text-indigo-600 transition-colors line-clamp-2">
                    {blog.title}
                  </h2>
                </Link>

                <div
                  className="text-gray-600 mb-4 line-clamp-3 prose prose-sm prose-indigo"
                  dangerouslySetInnerHTML={{ __html: blog.content }}
                />

                <Link
                  to={`/blogs/${blog.slug}`}
                  className="inline-flex items-center text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
                >
                  Read more
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-16">
            <nav className="flex items-center space-x-2">
              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`px-4 py-2 border text-sm font-medium rounded-md ${
                      page === pageNum
                        ? "bg-indigo-600 text-white border-indigo-600"
                        : "border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              )}

              <button
                disabled={page === totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default PublicBlogList;
