import React from "react";
import { Menu } from "lucide-react";

const Navbar = ({ toggleSidebar }) => {
  let admin = null;

  const adminData = localStorage.getItem("admin");
  if (adminData && adminData !== "undefined") {
    try {
      admin = JSON.parse(adminData);
    } catch (error) {
      console.error("Failed to parse admin from localStorage", error);
    }
  }

  return (
    <header className="w-full bg-white shadow-sm px-6 py-4 flex items-center justify-between md:justify-end">
      <button
        className="block md:hidden text-gray-600 hover:text-indigo-600"
        onClick={toggleSidebar}
      >
        <Menu size={24} />
      </button>

      <div className="text-sm text-gray-600">
        Logged in as{" "}
        <span className="font-medium text-indigo-600">
          {admin?.name || "Admin"}
        </span>
      </div>
    </header>
  );
};

export default Navbar;
