import { createConnection } from "typeorm";

import db from "../database";

jest.unmock("../database");
jest.unmock("parse-database-url");

describe("Database", () => {
  it("dev", async () => {
    db({ dev: true })();
    // @ts-ignore
    expect(createConnection.mock.calls[0][0]).toMatchSnapshot();
  });
  it("prod", async () => {
    process.env.DATABASE_URL =
      "postgresql://testUser:testPassword@testHost/testDb";
    db({ dev: false })();
    // @ts-ignore
    expect(createConnection.mock.calls[0][0]).toMatchSnapshot();
  });
});
