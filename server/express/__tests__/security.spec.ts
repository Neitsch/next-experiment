import { Express } from "express";

import jwt from "express-jwt";
import helmet from "helmet";
import { v4 as uuidv4 } from "uuid";

import security from "../security";

jest.unmock("../security");

describe("Express Server Launch", () => {
  describe("Security", () => {
    it("instantiates", async () => {
      // @ts-ignore
      helmet.mockReturnValue("helmet");
      // @ts-ignore
      helmet.contentSecurityPolicy.mockReturnValue("contentSecurityPolicy");
      // @ts-ignore
      jwt.mockReturnValue("jwt");
      // @ts-ignore
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
          // @ts-ignore
          expect(data.locals.nonce).toBeTruthy();
          resolve();
        });
        express.use.mock.calls.filter(
          (c: Array<string>) => c[1] === "contentSecurityPolicy",
        )[0][0](null, data, cb);
      });

      expect(
        // @ts-ignore
        helmet.contentSecurityPolicy.mock.calls[0][0].directives.scriptSrc.filter(
          (a: string | any) => a instanceof Function,
        )[0](null, { locals: { nonce: "data" } }),
      ).toEqual("'nonce-data'");
    });
  });
});
