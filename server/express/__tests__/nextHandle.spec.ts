import { Express } from "express";
import nextServer from "next";

// @ts-ignore
import { getRequestHandler } from "../../../lib/routes";
import nextHandle from "../nextHandle";

jest.unmock("../nextHandle");
jest.mock("../../../lib/routes", () => ({
  getRequestHandler: jest.fn().mockReturnValue(jest.fn()),
}));

describe("Express Server Startup", () => {
  describe("Next", () => {
    it("works", async () => {
      // @ts-ignore
      nextServer.mockReturnValue({
        prepare: jest.fn(),
      });
      const get = jest.fn();
      const express = jest.fn<Express>().mockReturnValue({
        get,
      })();
      await nextHandle({ dev: false })(express);
      expect(getRequestHandler()).not.toHaveBeenCalled();
      get.mock.calls[0][1]();
      expect(getRequestHandler()).toHaveBeenCalled();
    });
  });
});
