import { useEffect, useState } from "react";
import axios from "@/lib/axiosInstance";
import { isAuthenticated } from "@/lib/auth";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    if (isAuthenticated()) {
      axios
        .get("/me")
        .then((res) => {
          setUser(res.data.data);
          setLoadingUser(false);
        })
        .catch((error) => {
          console.error(
            "Gagal mengambil data user:",
            error.response || error.message
          );
          // if token invalid or expired, redirect to login
          if (
            error.response &&
            (error.response.status === 401 || error.response.status === 403)
          ) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            window.location.href = "/login";
          }
          setLoadingUser(false);
        });
    } else {
      setLoadingUser(false);
    }
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      {loadingUser ? (
        <p>Loading...</p>
      ) : user ? (
        <p className="text-lg">
          Welcome back,{" "}
          <span className="font-semibold">{user.name}</span>!
        </p>
      ) : (
        <p className="text-red-500">
          Failed to fetch user data. Please login again.
        </p>
      )}
      <div className="mt-8">
        <p>Use the navigation menu to navigate.</p>
      </div>
    </div>
  );
};

export default Dashboard;
