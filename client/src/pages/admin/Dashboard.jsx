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
    return <div className="text-center py-6 text-sm">Loading dashboard...</div>;
  }

  return (
    <div className="p-3 space-y-5 max-w-full overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
        <h1 className="text-base sm:text-lg font-semibold">Dashboard</h1>
        <Link
          to="/admin/blogs/create"
          className="bg-indigo-600 text-white text-xs px-3 py-1.5 rounded hover:bg-indigo-700 transition"
        >
          ➕ Create Blog
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="bg-white p-4 rounded-md border shadow-sm overflow-hidden max-h-[200px]">
          <p className="text-gray-500 text-xs">Total Blogs</p>
          <h2 className="text-base font-semibold">{stats.totalBlogs}</h2>
        </div>
        <div className="bg-white p-4 rounded-md border shadow-sm overflow-hidden max-h-[200px]">
          <p className="text-gray-500 text-xs">Total Views</p>
          <h2 className="text-base font-semibold">{stats.totalViews}</h2>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-4 rounded-md border shadow-sm overflow-hidden max-h-[300px]">
        <h2 className="text-sm font-medium mb-2">Monthly Blog Creation</h2>
        {stats.monthlyData.length > 0 ? (
          <div className="w-full h-[180px] sm:h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" fontSize={10} />
                <YAxis fontSize={10} />
                <Tooltip />
                <Bar dataKey="count" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-gray-400 text-xs">No chart data available.</p>
        )}
      </div>

      {/* Latest Blogs */}
      <div className="bg-white p-4 rounded-md border shadow-sm overflow-hidden max-h-[300px]">
        <h2 className="text-sm font-medium mb-2">Latest Blogs</h2>
        <div className="w-full overflow-auto">
          <table className="w-full text-xs text-left whitespace-nowrap">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-2">Title</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {stats.latestBlogs.length > 0 ? (
                stats.latestBlogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 max-w-[150px] truncate font-medium">
                      {blog.title}
                    </td>
                    <td className="px-3 py-2 capitalize">{blog.status}</td>
                    <td className="px-3 py-2 text-gray-500">
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
                    className="px-3 py-4 text-center text-gray-400"
                  >
                    No blog posts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
