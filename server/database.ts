// @ts-ignore
import parseDbUrl from "parse-database-url";
import { createConnection } from "typeorm";

import { User } from "./entity/account/User";

const baseDbConfig = {
  entities: [User],
  migrations: ["server/migration/**/*.ts"],
  subscribers: ["server/subscriber/**/*.ts"],
  synchronize: true,
};

export default ({ dev }: { dev: boolean }) => () => {
  if (!dev) {
    const urlData = parseDbUrl(process.env.DATABASE_URL);
    const connectionData = {
      ...baseDbConfig,
      ...urlData,
      type: urlData.driver,
      username: urlData.user,
    };
    return createConnection(connectionData);
  }
  return createConnection({
    ...baseDbConfig,
    database: "db.sqlite",
    type: "sqlite",
  });
};
