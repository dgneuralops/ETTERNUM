import "server-only";
import { getDatabase, type Database } from "./connect";
import * as schema from "./schema";

/** Acesso preguiçoso ao banco: a conexão só abre na primeira consulta. */
export const db: Database = new Proxy({} as Database, {
  get(_target, prop) {
    const real = getDatabase();
    const value = Reflect.get(real, prop);
    return typeof value === "function" ? value.bind(real) : value;
  },
});

export { schema };
