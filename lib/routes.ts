import Routes from "next-routes";

const routes = new Routes().add("index", "/");
export default routes;
export const Link = routes.Link;
export const Router = routes.Router;
