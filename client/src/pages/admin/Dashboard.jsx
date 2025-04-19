import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalBlogs: 0,
    totalViews: 0,
    monthlyData: [],
    latestBlogs: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/api/blogs/stats");
        const { totalBlogs, totalViews, monthlyData, latestBlogs } = res.data;

        setStats({
          totalBlogs: totalBlogs || 0,
          totalViews: totalViews || 0,
          monthlyData: monthlyData || [],
          latestBlogs: latestBlogs || [],
        });
      } catch (err) {
        console.error("Error fetching blog stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading dashboard...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link
          to="/admin/blogs/create"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
        >
          ➕ Create Blog
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-600">Total Blogs</p>
          <h2 className="text-2xl font-bold">{stats.totalBlogs}</h2>
        </div>
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-gray-600">Total Views</p>
          <h2 className="text-2xl font-bold">{stats.totalViews}</h2>
        </div>
      </div>

      {/* Monthly Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Monthly Blog Creation</h2>
        {stats.monthlyData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#6366f1" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-sm">No chart data available.</p>
        )}
      </div>

      {/* Latest Blogs */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Latest Blogs</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="text-left px-4 py-2">Title</th>
              <th className="text-left px-4 py-2">Status</th>
              <th className="text-left px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {Array.isArray(stats.latestBlogs) &&
            stats.latestBlogs.length > 0 ? (
              stats.latestBlogs.map((blog) => (
                <tr key={blog._id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3 text-sm font-semibold text-gray-900">
                    {blog.title}
                  </td>
                  <td className="px-4 py-3 text-sm capitalize text-gray-700">
                    {blog.status}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(blog.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  className="px-4 py-6 text-center text-sm text-gray-500"
                >
                  No blog posts found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
