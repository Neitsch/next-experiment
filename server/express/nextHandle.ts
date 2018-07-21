import { Express, Request, Response } from "express";
import nextServer from "next";

import routes from "../../lib/routes";

export default ({ dev }: { dev: boolean }) => async (expressApp: Express) => {
  const app = nextServer({ dev });
  const handle = routes.getRequestHandler(app);
  await app.prepare();
  expressApp.get("*", (req: Request, res: Response) => {
    return handle(req, res);
  });
};
