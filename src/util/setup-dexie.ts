import Dexie from 'dexie';

export const setupDexie = <T extends { [key: string]: Dexie.Table<any, any> }>(
  dbName: string,
  dbVersion: number,
  tableSchemas: { [_ in keyof T]: string },
) => {
  const dexie = new Dexie(dbName);
  dexie.version(dbVersion).stores(tableSchemas);
  return dexie as Dexie & T;
};
