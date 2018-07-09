const Routes = require("next-routes");

const routes = new Routes()
  .add("index", "/")
  .add("auth/sign-in", "/auth/sign-in");
export default routes;
export const Link = routes.Link;
export const Router = routes.Router;
