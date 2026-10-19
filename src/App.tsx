import { createHashRouter, RouterProvider } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import Layout from "./components/Layout";
import Home from "./pages/Home/Home";
import Feed from "./pages/Feed/Feed";
import ProtectedRoute from "./MiddleWare/protectedRoute";
import Notifications from "./pages/Notifications/Notifications";
import Profile from "./pages/Profile/Profile";
import PostDatailes from "./features/PostDatailes/PostDatailes";
import MainRoute from "./MiddleWare/MainRoute";
import Setting from "./pages/setting/Setting";
import UserProfile from "./pages/Profile/UserProfile";

export default function App() {
  const routes = createHashRouter([
    {
      index: true,
      element: (
        <MainRoute>
          {" "}
          <Home />
        </MainRoute>
      ),
    },
    {
      path: "",
      element: <Layout />,
      children: [
        {
          path: "/feed",
          element: (
            <ProtectedRoute>
              <Feed />
            </ProtectedRoute>
          ),
        },
        {
          path: "/profile",
          element: (
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          ),
        },
        {
          path: "/settings",
          element: (
            <ProtectedRoute>
              <Setting />
            </ProtectedRoute>
          ),
        },
        {
          path: "/notifications",
          element: (
            <ProtectedRoute>
              <Notifications />
            </ProtectedRoute>
          ),
        },
      
        {
          path: "/postdetails/:id",
          element: (
            <ProtectedRoute>
              <PostDatailes />
            </ProtectedRoute>
          ),
        },
        {
          path: "/userprofile/:id",
          element: (
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          ),
        },
        { path: "*", element: <h2>not found</h2> },
      ],
    },
  ]);

  const query = new QueryClient();

  return (
    <QueryClientProvider client={query}>
      <ReactQueryDevtools initialIsOpen={false} />
      <div className="container">
        <ToastContainer />
        <RouterProvider router={routes}></RouterProvider>
      </div>
    </QueryClientProvider>
  );
}
