import { createConnection } from "typeorm";

import db from "../database";

jest.mock("typeorm", () => ({
  createConnection: jest.fn().mockReturnValue(jest.fn()),
}));

describe("Database", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  it("dev", async () => {
    db({ dev: true })();
    expect(createConnection.mock.calls[0][0]).toMatchSnapshot();
  });
  it("prod", async () => {
    db({ dev: false })();
    expect(createConnection.mock.calls[0][0]).toMatchSnapshot();
  });
});
