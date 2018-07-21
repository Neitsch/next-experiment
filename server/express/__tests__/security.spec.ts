import { Express } from "express";

import jwt from "express-jwt";
import helmet from "helmet";
import jwksRsa from "jwks-rsa";
import { v4 as uuidv4 } from "uuid";

import security from "../security";

jest.unmock("../security");

describe("Express Server Launch", () => {
  describe("Security", () => {
    it("instantiates", async () => {
      helmet.mockReturnValue("helmet");
      helmet.contentSecurityPolicy.mockReturnValue("contentSecurityPolicy");
      jwt.mockReturnValue("jwt");
      uuidv4.mockReturnValue("uuidv4");

      const express = jest.fn<Express>().mockReturnValue({
        use: jest.fn(),
      })();
      security({ dev: false, graphqlPath: "/graphql" })(express);
      expect(express.use).toHaveBeenCalledWith("helmet");
      expect(express.use).toHaveBeenCalledWith(
        expect.any(Function),
        "contentSecurityPolicy",
      );
      expect(express.use).toHaveBeenCalledWith("/graphql", "jwt");

      await new Promise(resolve => {
        const data = {
          locals: {},
        };
        const cb = jest.fn().mockImplementation(() => {
          expect(data.locals.nonce).toBeTruthy();
          resolve();
        });
        express.use.mock.calls.filter(
          c => c[1] === "contentSecurityPolicy",
        )[0][0](null, data, cb);
      });
    });
  });
});
