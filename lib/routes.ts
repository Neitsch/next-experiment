import * as Routes from "next-routes";

/* istanbul ignore next */
const RoutesBuilder = Routes.default ? Routes.default : Routes;

// @ts-ignore
const routes = new RoutesBuilder().add("index", "/");
export default routes;
export const Link = routes.Link;
export const Router = routes.Router;
