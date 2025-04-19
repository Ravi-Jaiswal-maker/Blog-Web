import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";
import { format } from "date-fns";
import { toast } from "react-hot-toast";

const BlogDetail = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch blog data
  const fetchBlog = async () => {
    try {
      const res = await api.get(`/api/blogs/${slug}`);
      setBlog(res.data);
    } catch (err) {
      toast.error("Failed to load blog");
    } finally {
      setLoading(false);
    }
  };

  // Function to increment view count when the blog is viewed
  const incrementViewCount = async () => {
    try {
      await api.put(`/api/blogs/${slug}/view`);
    } catch (err) {
      toast.error("Failed to increment view count");
    }
  };

  useEffect(() => {
    fetchBlog();
    incrementViewCount(); // Increment view count when the blog page is loaded
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-600 border-opacity-50"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="text-center text-red-500 font-medium mt-20 text-lg">
        Blog not found
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 space-y-10">
      <div className="space-y-4 text-center">
        <h1 className="text-5xl font-extrabold text-gray-900">{blog.title}</h1>
        <p className="text-lg text-gray-600">
          Published on{" "}
          <span className="font-medium">
            {format(new Date(blog.createdAt), "PPP")}
          </span>{" "}
          by{" "}
          <span className="text-indigo-600 font-semibold">
            {blog.createdBy}
          </span>
        </p>
        <p className="text-sm text-gray-500">Views: {blog.views}</p>{" "}
        {/* Show views count */}
      </div>

      {blog.image?.url && (
        <div className="rounded-xl overflow-hidden shadow-lg">
          <img
            src={blog.image.url}
            alt={blog.title}
            className="w-full h-96 object-cover transition-transform duration-300 transform hover:scale-105"
          />
        </div>
      )}

      <div className="bg-white shadow-lg rounded-xl p-8 mt-8">
        <div
          className="prose max-w-none prose-indigo dark:prose-invert"
          dangerouslySetInnerHTML={{
            __html: blog.content,
          }}
        />
      </div>

      <div className="flex justify-center mt-8">
        <a
          href="/"
          className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg text-lg font-semibold hover:bg-indigo-700 transition-colors duration-300"
        >
          Back to Blogs
        </a>
      </div>
    </div>
  );
};

export default BlogDetail;
