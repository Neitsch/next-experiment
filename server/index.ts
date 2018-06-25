import {
  compression,
  cookieParser,
  cors,
  expressServer,
  graphqlHTTP,
  jwksRsa,
  jwt,
} from "../typeDefs/expressShim";
import { nextServer } from "../typeDefs/nextShim";
import GraphqlSchema from "./graphql/schema";

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = nextServer({ dev });
const handle = app.getRequestHandler();

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
    const server = expressServer();
    server.use(compression());
    server.use(
      cors({
        origin: "http://localhost:3000",
      }),
    );
    server.use(cookieParser());
    server.use("/graphql", checkJwt, (req, res) =>
      graphqlHTTP({
        context: req.user.sub,
        graphiql: true,
        rootValue: req.user.sub,
        schema: GraphqlSchema,
      })(req, res),
    );
    server.get("*", (req, res) => {
      return handle(req, res);
    });
    server.listen(port, err => {
      if (err) {
        throw err;
      }
    });
  })
  /* tslint:disable-next-line */
  .catch(c => console.error(c));
