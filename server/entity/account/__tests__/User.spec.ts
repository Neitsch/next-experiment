import { User } from "../User";

jest.unmock("../User");

describe("User", () => {
  it("constructs", () => {
    Object.defineProperty(User, "sub", { value: jest.fn() });
    expect(new User("abc").sub).toEqual("abc");
  });
});
