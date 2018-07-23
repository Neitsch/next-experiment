import { Express } from "express";

import graphql from "../graphql-server";
import next from "../nextHandle";
import security from "../security";
import common from "../setupCommonMiddleware";

import index from "../index";

jest.unmock("../index");

describe("Express Server Launch", () => {
  const config = {
    dev: false,
    graphqlPath: "/graphql",
    initialContext: {},
  };
  beforeEach(() => {
    // @ts-ignore
    graphql.mockReturnValue(jest.fn());
    // @ts-ignore
    next.mockReturnValue(jest.fn());
    // @ts-ignore
    security.mockReturnValue(jest.fn());
  });
  it("Common", () => {
    const invocation = jest.fn<Express>()();
    index(config)(invocation);
    expect(common).toHaveBeenCalledTimes(1);
    expect(common).toHaveBeenCalledWith(invocation);
  });
  it("Security", () => {
    const invocation = jest.fn<Express>()();
    index(config)(invocation);
    expect(security).toHaveBeenCalledTimes(1);
    expect(security).toHaveBeenCalledWith(config);
    expect(security(config)).toHaveBeenCalledTimes(1);
    expect(security(config)).toHaveBeenCalledWith(invocation);
  });
  it("Graphql Server", () => {
    const invocation = jest.fn<Express>()();
    index(config)(invocation);
    expect(graphql).toHaveBeenCalledTimes(1);
    expect(graphql).toHaveBeenCalledWith(config);
    expect(graphql(config)).toHaveBeenCalledTimes(1);
    expect(graphql(config)).toHaveBeenCalledWith(invocation);
  });
  it("Next", () => {
    const invocation = jest.fn<Express>()();
    index(config)(invocation);
    expect(next).toHaveBeenCalledTimes(1);
    expect(next).toHaveBeenCalledWith(config);
    expect(next(config)).toHaveBeenCalledTimes(1);
    expect(next(config)).toHaveBeenCalledWith(invocation);
  });
});
