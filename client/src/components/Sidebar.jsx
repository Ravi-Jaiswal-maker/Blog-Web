import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, FileText, LogOut } from "lucide-react";

const Sidebar = () => {
  const navItems = [
    {
      name: "Dashboard",
      to: "/admin/dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    { name: "Blogs", to: "/admin/blogs", icon: <FileText size={18} /> },
    {
      name: "CreateBlog",
      to: "/admin/blogs/create",
      icon: <FileText size={18} />,
    },
  ];

  return (
    <aside className="w-64 bg-white shadow-md h-full hidden md:block">
      <div className="p-6 text-xl font-bold text-indigo-600">Blog Panel</div>
      <nav className="px-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-indigo-100 text-indigo-600 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}

        <button
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/admin/login";
          }}
          className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-100 rounded-lg transition duration-200 mt-10"
        >
          <LogOut size={18} />
          Logout
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
