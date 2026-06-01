import React from "react";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const AdminRoute: React.FC<{ children: any }> = ({ children }) => {
  const { currentUser, loading } = useContext(AuthContext);
  if (loading) return <div>Loading...</div>;
  if (!currentUser || currentUser.role !== "ADMIN") return <Navigate to="/" replace />;
  return children;
};

export default AdminRoute;
