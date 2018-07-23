import { ApolloServer } from "apollo-server-express";
import { Express } from "express";

import graphql from "../graphql-server";

jest.unmock("../graphql-server");

describe("Express Server Launch", () => {
  describe("Graphql", () => {
    let express: Express;
    let use: jest.Mock<{}>;
    beforeEach(() => {
      use = jest.fn();
      express = jest.fn<Express>().mockReturnValue({
        use,
      })();
    });
    it("Error Reporting", () => {
      graphql({
        dev: false,
        graphqlPath: "/graphql",
        initialContext: {
          testCtx: {},
        },
      })(express);
      expect(use).toHaveBeenCalledTimes(1);
      const res = {
        json: jest.fn(),
      };
      const error = {
        message: "TestMessage",
        name: "TestError",
      };
      use.mock.calls[0][0](error, {}, res);
      expect(res.json.mock.calls[0][0].errors[0]).toEqual(error);
      expect(res.json).toHaveBeenCalledTimes(1);
      use.mock.calls[0][0](null, {}, res);
      expect(res.json).toHaveBeenCalledTimes(1);
    });
    it("Gets context", () => {
      graphql({
        dev: false,
        graphqlPath: "/graphql",
        initialContext: {
          testCtx: {},
        },
      })(express);
      const req = {
        user: {
          sub: "TestSub",
        },
      };
      // @ts-ignore
      const ctx = ApolloServer.mock.calls[0][0].context({ req });
      expect(ctx).toEqual({
        testCtx: {},
        userSub: "TestSub",
      });
    });
    it("Is applied to app", () => {
      graphql({
        dev: false,
        graphqlPath: "/graphqlPath",
        initialContext: {
          testCtx: {},
        },
      })(express);
      // @ts-ignore
      expect(ApolloServer().applyMiddleware).toHaveBeenCalledWith({
        app: express,
        path: "/graphqlPath",
      });
    });
  });
});
