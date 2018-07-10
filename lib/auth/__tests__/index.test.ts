describe("extracts info from hash", () => {
  it("works", () => {
    jest.resetModules();
    jest.doMock("js-cookie");
    jest.doMock("jwt-decode", () => c => c);
    jsdom.reconfigure({
      url: "https://localhost:3000/test?id_token=a&access_token=b&state=c",
    });
    process.browser = true;
    const data = require("../index").extractInfoFromHash();
    expect(data.token).toEqual("a");
    expect(data.access_token).toEqual("b");
    expect(data.secret).toEqual("c");
  });
  it("works server", () => {
    jest.resetModules();
    jest.doMock("js-cookie");
    jest.doMock("jwt-decode", () => c => c);
    jsdom.reconfigure({
      url: "https://localhost:3000/test?id_token=a&access_token=b&state=c",
    });
    process.browser = false;
    const data = require("../index").extractInfoFromHash();
    expect(data).toBeUndefined();
  });
});

describe("Sets Token", () => {
  it("works", () => {
    jest.resetModules();
    const setCookieFun = jest.fn();
    jest.doMock("jwt-decode", () => c => c);
    jest.doMock("js-cookie", () => ({
      set: setCookieFun,
    }));
    process.browser = true;
    require("../index").setToken("token", "access token", 100);
    expect(setCookieFun).toBeCalledWith("user", "token", expect.anything());
    expect(setCookieFun).toBeCalledWith("jwt", "token", expect.anything());
    expect(setCookieFun).toBeCalledWith(
      "token",
      "access token",
      expect.anything(),
    );
    expect(setCookieFun).toHaveBeenCalledTimes(3);
  });
  it("works server", () => {
    jest.resetModules();
    const setCookieFun = jest.fn();
    jest.doMock("jwt-decode", () => c => c);
    jest.doMock("js-cookie", () => ({
      set: setCookieFun,
    }));
    process.browser = false;
    require("../index").setToken("token", "access token");
    expect(setCookieFun).toHaveBeenCalledTimes(0);
  });
});

describe("Unsets Token", () => {
  it("works", () => {
    jest.resetModules();
    const setCookieFun = jest.fn();
    jest.doMock("jwt-decode", () => c => c);
    jest.doMock("js-cookie", () => ({
      remove: setCookieFun,
    }));
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
    expect(setCookieFun).toBeCalledWith("secret");
    expect(setCookieFun).toBeCalledWith("user");
    expect(setCookieFun).toBeCalledWith("jwt");
    expect(setCookieFun).toHaveBeenCalledTimes(3);
    expect(setItem).toHaveBeenLastCalledWith("logout", d);
  });
  it("works server", () => {
    jest.resetModules();
    const setCookieFun = jest.fn();
    jest.doMock("jwt-decode", () => c => c);
    jest.doMock("js-cookie", () => ({
      remove: setCookieFun,
    }));
    process.browser = false;
    require("../index").unsetToken();
    expect(setCookieFun).toHaveBeenCalledTimes(0);
  });
});

describe("Server Cookie", () => {
  it("gets cookie from header", () => {
    jest.resetModules();
    jest.doMock("jwt-decode", () => c => c);
    jest.doMock("js-cookie");
    const user = require("../index").getUserFromServerCookie({
      headers: {
        cookie: "jwt=hey;",
      },
    });
    expect(user).toEqual("hey");
  });
  it("fail paths", () => {
    jest.resetModules();
    jest.doMock("jwt-decode", () => c => c);
    jest.doMock("js-cookie");
    const user1 = require("../index").getUserFromServerCookie({
      headers: {
        cookie: "abc=hey;",
      },
    });
    expect(user1).toBeUndefined();
    const user2 = require("../index").getUserFromServerCookie({
      headers: {},
    });
    expect(user2).toBeUndefined();
  });
});

describe("Client Cookie", () => {
  it("gets cookie from header", () => {
    jest.resetModules();
    jest.doMock("jwt-decode", () => c => c);
    jest.doMock("js-cookie", () => ({
      getJSON: () => "hey",
    }));
    const user1 = require("../index").getUserFromLocalCookie();
    expect(user1).toEqual("hey");
    const user2 = require("../index").getLocalCookie();
    expect(user2).toEqual("hey");
  });
});

describe("Secret", () => {
  it("Set", () => {
    jest.resetModules();
    jest.doMock("jwt-decode", () => c => c);
    const setFn = jest.fn();
    jest.doMock("js-cookie", () => ({
      set: setFn,
    }));
    require("../index").setSecret("hey");
    expect(setFn).toHaveBeenCalledWith("secret", "hey");
  });
  it("Check", () => {
    jest.resetModules();
    jest.doMock("jwt-decode", () => c => c);
    const getFn = jest.fn().mockImplementation(() => "hey");
    jest.doMock("js-cookie", () => ({
      get: getFn,
    }));
    const check = require("../index").checkSecret("hey");
    expect(getFn).toHaveBeenCalledWith("secret");
    expect(check).toBe(true);
  });
});
