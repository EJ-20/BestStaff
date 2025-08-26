import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import "./index.css";
import { AuthProvider } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import AppLayout from "./ui/AppLayout";
import LoginPage from "./pages/LoginPage";
import RecognizePage from "./pages/RecognizePage";
import LeaderboardPage from "./pages/LeaderboardPage";
import RewardsPage from "./pages/RewardsPage";
import ProfilePage from "./pages/ProfilePage";
import AdminPage from "./pages/AdminPage";

const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },

  {
    element: <ProtectedRoute />, // gate everything below
    children: [
      {
        path: "/",
        element: <AppLayout />,
        children: [
          { index: true, element: <Navigate to="/recognize" replace /> },
          { path: "recognize", element: <RecognizePage /> },
          { path: "leaderboard", element: <LeaderboardPage /> },
          { path: "rewards", element: <RewardsPage /> },
          { path: "profile", element: <ProfilePage /> },
          { path: "admin", element: <AdminPage /> },
        ],
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
