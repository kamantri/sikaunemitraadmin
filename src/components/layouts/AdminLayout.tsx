
import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import AdminSidebar from "./AdminSidebar";
import TopNav from "./TopNav";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

const AdminLayout = () => {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();
  
  useEffect(() => {
    if (!checkAuth()) {
      toast.error("Please login to access the admin dashboard");
      navigate("/");
    }
  }, [navigate, checkAuth]);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <TopNav />
          <main className="flex-1 p-6 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AdminLayout;
