import express from "express";

import db from "./database";
import exp from "./express/index";

(async () => {
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const initialConfig = {
    dev: process.env.NODE_ENV !== "production",
  };

  const app = express();
  const connection = await db(initialConfig)();
  exp({
    ...initialConfig,
    graphqlPath: "/graphql",
    initialContext: {
      connection,
    },
  })(app);
  app.listen(port, (err: Error) => {
    if (err) {
      throw err;
    }
  });
})();
