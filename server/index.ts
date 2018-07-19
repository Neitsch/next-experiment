import { formatError } from "apollo-errors";
import { ApolloServer } from "apollo-server-express";
import { createComplexityLimitRule } from "graphql-validation-complexity";
// import parseDbUrl from "parse-database-url";
import { v4 as uuidv4 } from "uuid";

import routes from "../lib/routes";
import {
  compression,
  cookieParser,
  cors,
  expressServer,
  jwksRsa,
  jwt,
} from "../typeDefs/expressShim";
import { nextServer } from "../typeDefs/nextShim";
import GraphqlSchema from "./graphql/schema";

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = nextServer({ dev });
const handle = routes.getRequestHandler(app);

const checkJwt = jwt({
  algorithms: ["RS256"],
  audience: "_ic7CjcpbO_QPqU-I0NT8C67vk16h9ee",
  issuer: "https://condor-club.auth0.com/",
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://condor-club.auth0.com/.well-known/jwks.json`,
    rateLimit: true,
  }),
});

app
  .prepare()
  .then(() => {
    // const dbConfig = parseDbUrl(process.env["DATABASE_URL"] ? );
    const server = expressServer();
    server.use(compression());
    server.use(
      cors({
        origin: "http://localhost:3000",
      }),
    );
    server.use(cookieParser());
    server.use("/graphql", checkJwt);
    new ApolloServer({
      cacheControl: true,
      context: ({ req }) => {
        return {
          userSub: req.user.sub,
        };
      },
      debug: dev /*
      formatError: e => {
        console.error(e);
        return e;
      },*/,
      formatError,
      schema: GraphqlSchema,
      tracing: dev,
      validationRules: [
        createComplexityLimitRule(1000, {
          listFactor: 10,
          objectCost: 1,
          scalarCost: 1,
        }),
      ],
    }).applyMiddleware({
      app: server,
      path: "/graphql",
    });
    server.get("*", (req, res) => {
      const nonce = uuidv4();
      req.params.nonce = nonce;
      if (!dev) {
        res.set(
          "Content-Security-Policy",
          `default-src 'self' *.auth0.com 'nonce-${nonce}'; script-src 'self' *.auth0.com 'nonce-${nonce}'; style-src 'self' *.auth0.com 'nonce-${nonce}' 'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU=' 'sha256-HHV9fpgXZciNMx/a9/fYJs5easPqtqmMjfsvEiT6J58=';`,
        );
      }
      return handle(req, res);
    });
    server.use((error, _, res, __) => {
      res.json({ errors: [{ name: error.name, message: error.message }] });
    });
    server.listen(port, err => {
      if (err) {
        throw err;
      }
    });
  })
  /* tslint:disable-next-line */
  .catch(c => console.error(c));
