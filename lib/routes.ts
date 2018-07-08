const Routes = require("next-routes");

const routes = new Routes()
  .add("index", "/")
  .add("sign-in", "/auth/sign-in")
  .add("signed-in", "/auth/signed-in");
export default routes;
export const Link = routes.Link;
export const Router = routes.Router;
