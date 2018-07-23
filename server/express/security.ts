import { Express, NextFunction, Request, Response } from "express";
import jwt from "express-jwt";
import helmet from "helmet";
import jwksRsa from "jwks-rsa";
import { v4 as uuidv4 } from "uuid";

export const withHelmet = (expressApp: Express, { dev }: { dev: boolean }) =>
  expressApp.use(
    helmet({
      hsts: !dev,
      referrerPolicy: { policy: "same-origin" },
    }),
  );

export const withCSP = (expressApp: Express) => {
  const addNonce = (_: Request, res: Response, next: NextFunction) => {
    res.locals.nonce = uuidv4();
    next();
  };
  const getNonce = (_: Request, res: Response) => `'nonce-${res.locals.nonce}'`;
  const cspPolicy = helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'", "*.auth0.com"],
      scriptSrc: ["'self'", "*.auth0.com", getNonce],
      styleSrc: [
        "'self'",
        "*.auth0.com",
        getNonce,
        "'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='",
        "'sha256-HHV9fpgXZciNMx/a9/fYJs5easPqtqmMjfsvEiT6J58='",
      ],
    },
  });
  expressApp.use(addNonce, cspPolicy);
};

export const withJwt = (
  expressApp: Express,
  { graphqlPath }: { graphqlPath: string },
) => {
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
  expressApp.use(graphqlPath, checkJwt);
};

export default ({
  dev,
  graphqlPath,
}: {
  dev: boolean;
  graphqlPath: string;
}) => (expressApp: Express) => {
  withHelmet(expressApp, { dev });
  withCSP(expressApp);
  withJwt(expressApp, { graphqlPath });
  return expressApp;
};
