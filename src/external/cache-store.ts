import Dexie from 'dexie';
import { fromNullable, none, some } from 'fp-ts/lib/Option';
import { tryCatch } from 'fp-ts/lib/TaskEither';
import { Cacheable, CacheStore, Inflater } from '../domain/cache-store';

const DexieCacheStoreTablePK = 'cacheKey';
const DexieCacheStoreTableTimestamp = 'cachedAt';

interface CacheRecord<C extends Cacheable<any>> {
  [DexieCacheStoreTablePK]: C['cacheKey'];
  [DexieCacheStoreTableTimestamp]: number;
  cachedValue: ReturnType<C['toJSON']>;
}

export type DexieCacheStoreTable<C extends Cacheable<any>> = Dexie.Table<CacheRecord<C>, C['cacheKey']>;

export const DexieCacheStoreTableSchema = `${DexieCacheStoreTablePK}, ${DexieCacheStoreTableTimestamp}`;

export class DexieCacheStore<C extends Cacheable<any>> implements CacheStore<C> {
  public constructor(private readonly table: DexieCacheStoreTable<C>, private readonly cacheMaxAge: number) {}

  public async get(cacheKey: C['cacheKey'], inflater: Inflater<C>) {
    return tryCatch(() => this.table.get(cacheKey), String)
      .map(fromNullable)
      .map((record) => record.filter(({ cachedAt }) => nowSec() - cachedAt <= this.cacheMaxAge))
      .map((record) => record.map(({ cachedValue }) => inflater(cachedValue)))
      .run();
  }

  public async set(cacheable: C) {
    const record = {
      cacheKey: cacheable.cacheKey,
      cachedAt: nowSec(),
      cachedValue: cacheable.toJSON(),
    };
    return tryCatch(() => this.table.put(record), String).run();
  }

  public async del(cacheKey: C['cacheKey']) {
    return tryCatch(() => this.table.delete(cacheKey), String).run();
  }

  public async delExpiredAll() {
    const exec = () =>
      this.table
        .where(DexieCacheStoreTableTimestamp)
        .below(nowSec() - this.cacheMaxAge)
        .delete();
    return await tryCatch(exec, String)
      .map((affected) => (affected > 0 ? some(affected) : none))
      .run();
  }
}

const nowSec = () => Math.ceil(Date.now() / 1000);
