
import { RouteObject } from "react-router-dom";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import AboutUs from "@/pages/AboutUs";
import Imprint from "@/pages/Imprint";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";

/**
 * Public routes that don't require authentication
 */
export const publicRoutes: RouteObject[] = [
  {
    path: "/",
    element: <Index />,
    errorElement: <NotFound />,
  },
  {
    path: "/about",
    element: <AboutUs />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/imprint",
    element: <Imprint />,
  },
  {
    path: "/privacy",
    element: <Privacy />,
  },
  {
    path: "/terms",
    element: <Terms />,
  },
];
