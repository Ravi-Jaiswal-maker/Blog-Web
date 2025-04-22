import React from "react";
import { NavLink } from "react-router-dom";
import { LayoutDashboard, FileText, LogOut, X } from "lucide-react";

const Sidebar = ({ isOpen, setIsOpen }) => {
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
    <>
      {/* Overlay on small screens */}
      <div
        className={`fixed inset-0 bg-black/40 z-30 transition-opacity md:hidden ${
          isOpen ? "block" : "hidden"
        }`}
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Sidebar itself */}
      <aside
        className={`fixed z-40 top-0 left-0 h-full w-64 bg-white shadow-md transform transition-transform duration-300 md:static md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 text-xl font-bold text-indigo-600 flex justify-between items-center">
          VibeScript Blog
          <button className="md:hidden" onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </div>

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
              onClick={() => setIsOpen(false)} // auto-close on mobile
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
    </>
  );
};

export default Sidebar;
