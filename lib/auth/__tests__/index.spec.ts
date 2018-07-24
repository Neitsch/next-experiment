import { get, getJSON, remove, set } from "js-cookie";
import jwtd from "jwt-decode";

import {
  checkSecret,
  extractInfoFromHash,
  getLocalCookie,
  getUserFromLocalCookie,
  getUserFromServerCookie,
  setSecret,
  setToken,
  unsetToken,
} from "../index";

jest.unmock("../index");

describe("extracts info from hash", () => {
  beforeAll(() => {
    jwtd.mockImplementation(c => c);
  });
  it("works", () => {
    jsdom.reconfigure({
      url: "https://localhost:3000/test?id_token=a&access_token=b&state=c",
    });
    process.browser = true;
    const data = extractInfoFromHash();
    expect(data.token).toEqual("a");
    expect(data.access_token).toEqual("b");
    expect(data.secret).toEqual("c");
  });
  it("works server", () => {
    jsdom.reconfigure({
      url: "https://localhost:3000/test?id_token=a&access_token=b&state=c",
    });
    process.browser = false;
    const data = extractInfoFromHash();
    expect(data).toBeUndefined();
  });
});

describe("Sets Token", () => {
  it("works", () => {
    process.browser = true;
    require("../index").setToken("token", "access token", 100);
    expect(set).toBeCalledWith("user", "token", expect.anything());
    expect(set).toBeCalledWith("jwt", "token", expect.anything());
    expect(set).toBeCalledWith("token", "access token", expect.anything());
    expect(set).toHaveBeenCalledTimes(3);
  });
  it("works server", () => {
    process.browser = false;
    setToken("token", "access token");
    expect(set).toHaveBeenCalledTimes(0);
  });
});

describe("Unsets Token", () => {
  it("works", () => {
    const d = new Date();
    const sameDate = {
      now: () => d,
    };
    const setItem = jest.fn();
    global.localStorage = {
      setItem,
    };
    global.Date = sameDate;
    process.browser = true;
    require("../index").unsetToken();
    expect(remove).toBeCalledWith("secret");
    expect(remove).toBeCalledWith("user");
    expect(remove).toBeCalledWith("jwt");
    expect(remove).toHaveBeenCalledTimes(3);
    expect(setItem).toHaveBeenLastCalledWith("logout", d);
  });
  it("works server", () => {
    process.browser = false;
    unsetToken();
    expect(remove).toHaveBeenCalledTimes(0);
  });
});

describe("Server Cookie", () => {
  it("gets cookie from header", () => {
    const user = getUserFromServerCookie({
      headers: {
        cookie: "jwt=hey;",
      },
    });
    expect(user).toEqual("hey");
  });
  it("fail paths", () => {
    const user1 = getUserFromServerCookie({
      headers: {
        cookie: "abc=hey;",
      },
    });
    expect(user1).toBeUndefined();
    const user2 = getUserFromServerCookie({
      headers: {},
    });
    expect(user2).toBeUndefined();
  });
});

describe("Client Cookie", () => {
  it("gets cookie from header", () => {
    getJSON.mockReturnValue("hey");
    const user1 = getUserFromLocalCookie();
    expect(user1).toEqual("hey");
    const user2 = getLocalCookie();
    expect(user2).toEqual("hey");
  });
});

describe("Secret", () => {
  it("Set", () => {
    setSecret("hey");
    expect(set).toHaveBeenCalledWith("secret", "hey", expect.anything());
  });
  it("Check", () => {
    get.mockReturnValue("hey");
    const check = checkSecret("hey");
    expect(get).toHaveBeenCalledWith("secret");
    expect(check).toBe(true);
  });
});
