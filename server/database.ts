// @ts-ignore
import parseDbUrl from "parse-database-url";
import { createConnection } from "typeorm";

const baseDbConfig = {
  entities: ["server/entity/account/*.ts"],
  migrations: ["server/migration/**/*.ts"],
  subscribers: ["server/subscriber/**/*.ts"],
  synchronize: true,
};

export default ({ dev }: { dev: boolean }) => () => {
  if (!dev) {
    const url_data = parseDbUrl(process.env.DATABASE_URL);
    const connectionData = {
      ...baseDbConfig,
      ...url_data,
      type: url_data.driver,
    };
    return createConnection(connectionData);
  }
  return createConnection({
    ...baseDbConfig,
    database: "db.sqlite",
    type: "sqlite",
  });
};
