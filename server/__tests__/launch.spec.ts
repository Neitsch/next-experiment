import express from "express";

import setup from "../express/index";
import { launchFn } from "../launch";

jest.unmock("../launch");
jest.mock("../database", () => jest.fn().mockReturnValue(jest.fn()));
jest.mock("../express/index", () => jest.fn().mockReturnValue(jest.fn()));

describe("Server start", () => {
  it("launches", async () => {
    await launchFn();
    expect(express().listen).toHaveBeenCalled();
    // @ts-ignore
    expect(setup()).toHaveBeenCalled();
    // @ts-ignore
    expect(() => express().listen.mock.calls[0][1](new Error())).toThrowError();
    // @ts-ignore
    expect(() => express().listen.mock.calls[0][1]()).not.toThrowError();
  });
});
