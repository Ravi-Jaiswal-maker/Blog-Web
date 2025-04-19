// import React, { useEffect, useState } from "react";
// import { Link, useSearchParams } from "react-router-dom";
// import api from "../../api";
// import { format } from "date-fns";
// import { toast } from "react-hot-toast";

// const AllBlogs = () => {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const [blogs, setBlogs] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [totalPages, setTotalPages] = useState(1);

//   const page = parseInt(searchParams.get("page") || "1");

//   const fetchBlogs = async () => {
//     setLoading(true);
//     try {
//       const res = await api.get(`/api/blogs?page=${page}&limit=6`);
//       setBlogs(res.data.blogs);
//       setTotalPages(res.data.totalPages);
//     } catch (err) {
//       toast.error("Failed to load blogs");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchBlogs();
//     // eslint-disable-next-line
//   }, [page]);

//   const changePage = (newPage) => {
//     setSearchParams({ page: newPage });
//   };

//   return (
//     <div className="max-w-5xl mx-auto p-6 space-y-6">
//       <h2 className="text-2xl font-semibold mb-4">Latest Blogs</h2>

//       {loading ? (
//         <p>Loading...</p>
//       ) : blogs.length === 0 ? (
//         <p>No blogs found.</p>
//       ) : (
//         <>
//           <div className="grid md:grid-cols-2 gap-6">
//             {blogs.map((blog) => (
//               <div
//                 key={blog._id}
//                 className="bg-white shadow rounded-lg overflow-hidden"
//               >
//                 {blog.image?.url && (
//                   <img
//                     src={blog.image.url}
//                     alt="Blog"
//                     className="h-52 w-full object-cover"
//                   />
//                 )}
//                 <div className="p-4 space-y-2">
//                   <h3 className="text-xl font-semibold">{blog.title}</h3>
//                   <p className="text-sm text-gray-500">
//                     By {blog.createdBy} on{" "}
//                     {format(new Date(blog.createdAt), "PPP")}
//                   </p>
//                   <Link
//                     to={`/blog/${blog.slug}`}
//                     className="inline-block text-indigo-600 hover:underline"
//                   >
//                     Read more →
//                   </Link>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Pagination Controls */}
//           <div className="flex justify-center gap-3 mt-8">
//             {Array.from({ length: totalPages }, (_, i) => (
//               <button
//                 key={i}
//                 onClick={() => changePage(i + 1)}
//                 className={`px-4 py-2 rounded-md ${
//                   page === i + 1
//                     ? "bg-indigo-600 text-white"
//                     : "bg-gray-200 text-gray-800 hover:bg-gray-300"
//                 }`}
//               >
//                 {i + 1}
//               </button>
//             ))}
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default AllBlogs;

// second working code

import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../../api";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

const AllBlogs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  const page = parseInt(searchParams.get("page") || "1");

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchBlogs();
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line
  }, [page, searchTerm]);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await api.get(
        `/api/blogs?page=${page}&limit=6&search=${searchTerm}`
      );
      setBlogs(res.data.blogs);
      setTotalPages(res.data.totalPages);
    } catch (err) {
      toast.error("Failed to load blogs");
    } finally {
      setLoading(false);
    }
  };

  const changePage = (newPage) => {
    if (newPage !== page) {
      setSearchParams({ page: newPage });
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Explore Our Blog
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Discover insightful articles, tutorials, and industry news
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-md mx-auto mb-12">
        <div className="relative">
          <input
            type="text"
            placeholder="Search blogs..."
            className="w-full px-6 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-sm"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSearchParams({ page: 1 });
            }}
          />
          <svg
            className="absolute right-3 top-3 h-6 w-6 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[...Array(6)].map((_, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse"
            >
              <div className="bg-gray-200 h-48 w-full"></div>
              <div className="p-6 space-y-4">
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            </div>
          ))}
        </div>
      ) : blogs.length === 0 ? (
        <div className="text-center py-16">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">
            No blogs found
          </h3>
          <p className="mt-1 text-gray-500">
            {searchTerm
              ? "Try a different search term"
              : "Check back later for new content"}
          </p>
        </div>
      ) : (
        <>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {blogs.map((blog) => (
              <motion.div
                key={blog._id}
                variants={cardVariants}
                whileHover={{ y: -5 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
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
                    <span>{format(new Date(blog.createdAt), "PPP")}</span>
                    <span className="mx-2">•</span>
                    <span className="font-medium text-indigo-600">
                      {blog.createdBy}
                    </span>
                  </div>
                  <Link to={`/blog/${blog.slug}`}>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-indigo-600 transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                  </Link>
                  <div
                    className="text-gray-600 mb-4 line-clamp-3 prose prose-sm prose-indigo"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                  />
                  <Link
                    to={`/blog/${blog.slug}`}
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
              </motion.div>
            ))}
          </motion.div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-16">
              <nav className="flex items-center space-x-2">
                <button
                  disabled={page === 1}
                  onClick={() => changePage(page - 1)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (pageNum) => (
                    <button
                      key={`page-${pageNum}`}
                      onClick={() => changePage(pageNum)}
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
                  onClick={() => changePage(page + 1)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AllBlogs;
