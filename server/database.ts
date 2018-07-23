import { createConnection } from "typeorm";

const baseDbConfig = {
  entities: ["server/entity/account/*.ts"],
  migrations: ["server/migration/**/*.ts"],
  subscribers: ["server/subscriber/**/*.ts"],
  synchronize: true,
};

export default ({ dev }: { dev: boolean }) => () => {
  return createConnection(
    dev
      ? {
          ...baseDbConfig,
          database: "db.sqlite",
          type: "sqlite",
        }
      : {
          ...baseDbConfig,
          database: "test",
          host: "localhost",
          password: "test",
          port: 5432,
          type: "postgres",
          username: "test",
        },
  );
};
