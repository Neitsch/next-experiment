import { createServer } from "http";
import { parse } from "url";

import { nextServer } from "../typeDefs/nextShim";

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = nextServer({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);

    /* for Graphql
    const { pathname, query } = parsedUrl;
    if (pathname === "/at") {
      app.render(req, res, "/a", query);
    } else {
      handle(req, res, parsedUrl);
    } */
    handle(req, res, parsedUrl);
  }).listen(port, err => {
    if (err) {
      throw err;
    }
    /* tslint:disable-next-line */
    // console.log(`> Ready on http://localhost:${port}`);
  });
});
