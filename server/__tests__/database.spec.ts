import { createConnection } from "typeorm";

import db from "../database";

jest.unmock("../database");

describe("Database", () => {
  it("dev", async () => {
    db({ dev: true })();
    // @ts-ignore
    expect(createConnection.mock.calls[0][0]).toMatchSnapshot();
  });
  it("prod", async () => {
    db({ dev: false })();
    // @ts-ignore
    expect(createConnection.mock.calls[0][0]).toMatchSnapshot();
  });
});
