import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Express } from "express";

import common from "../setupCommonMiddleware";

jest.unmock("../setupCommonMiddleware");

describe("Express Server Launch", () => {
  describe("Common", () => {
    it("instantiates", () => {
      // @ts-ignore
      compression.mockReturnValue("compression");
      // @ts-ignore
      cookieParser.mockReturnValue("cookieParser");
      // @ts-ignore
      cors.mockReturnValue("cors");
      const express = jest.fn<Express>().mockReturnValue({
        use: jest.fn(),
      })();
      common(express);
      expect(express.use).toHaveBeenCalledTimes(3);
      expect(express.use).toHaveBeenCalledWith("compression");
      expect(express.use).toHaveBeenCalledWith("cookieParser");
      expect(express.use).toHaveBeenCalledWith("cors");
      expect(compression).toHaveBeenCalled();
      expect(cookieParser).toHaveBeenCalled();
      expect(cors).toHaveBeenCalled();
    });
  });
});
