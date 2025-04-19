import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Pages
import Login from "../pages/auth/LoginPage";
import ForgotPassword from "../pages/auth/ForgotPassword";
import ResetPassword from "../pages/auth/ResetPassword";

import Profile from "../pages/admin/Profile";
import CreateBlog from "../pages/admin/CreateBlog";
import EditBlog from "../pages/admin/EditBlog";
import AdminBlogList from "../pages/admin/AdminBlogList";

import BlogList from "../pages/blogs/PublicBlogList";
import BlogDetail from "../pages/blogs/BlogDetails";

// import NotFound from "../pages/NotFound";

// Layout
import DashboardLayout from "../layouts/Layout";

// Auth Context
import { useAuth } from "../context/AuthContext";
import Dashboard from "../pages/admin/Dashboard";

const AppRoutes = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Auth */}
      <Route
        path="/admin/login"
        element={!isAuthenticated ? <Login /> : <Navigate to="/admin/blogs" />}
      />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />

      {/* Public Blog Routes */}
      <Route path="/" element={<BlogList />} />
      <Route path="/blogs/:slug" element={<BlogDetail />} />

      {/* Protected Admin Routes */}
      {isAuthenticated && (
        <Route element={<DashboardLayout />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/profile" element={<Profile />} />
          <Route path="/admin/blogs" element={<AdminBlogList />} />
          <Route path="/admin/blogs/create" element={<CreateBlog />} />
          <Route path="/admin/blogs/edit/:id" element={<EditBlog />} />
        </Route>
      )}

      {/* Fallback */}
      {/* <Route path="*" element={<NotFound />} /> */}
    </Routes>
  );
};

export default AppRoutes;
