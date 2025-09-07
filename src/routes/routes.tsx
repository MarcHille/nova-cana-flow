
import { createBrowserRouter } from "react-router-dom";
import { publicRoutes } from "./publicRoutes";
import { protectedRoutes } from "./protectedRoutes";
import { adminRoutes } from "./adminRoutes";

/**
 * Combined router configuration with all application routes
 */
const routes = createBrowserRouter([
  ...publicRoutes,
  ...protectedRoutes,
  ...adminRoutes,
]);

export default routes;
