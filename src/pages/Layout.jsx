import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { isAuthenticated } from "@/lib/auth";
import { Toaster } from "react-hot-toast";

const AuthLayout = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate("/login", { replace: true });
    }
    setLoading(false);
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <p>Loading...</p>
      </div>
    );
  }

    // if authenticated, render Navbar and content from Outlet
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow p-4 md:p-8">
        <Outlet />
      </main>
      <Toaster position="bottom-right" />
      <footer className="bg-white border-t border-gray-200 p-4 text-center text-sm text-gray-600">
        &copy; 2025 My App.
      </footer>
    </div>
  );
};

export default AuthLayout;
