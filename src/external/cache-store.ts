import Dexie from 'dexie';
import { right } from 'fp-ts/lib/Either';
import { fromNullable, none, Option } from 'fp-ts/lib/Option';
import { fromEither, tryCatch } from 'fp-ts/lib/TaskEither';
import { Cacheable, CacheKey, CacheStore, Inflater, RawCacheableValue } from '../domain/cache-store';

export type DexieCacheStoreTable<R> = Dexie.Table<CacheRecord<R>, CacheKey>;

const DexieCacheStoreTablePK = 'cacheKey';
const DexieCacheStoreTableTimestamp = 'cachedAt';

export const DexieCacheStoreTableSchema = `${DexieCacheStoreTablePK}, ${DexieCacheStoreTableTimestamp}`;

interface CacheRecord<R extends RawCacheableValue> {
  [DexieCacheStoreTablePK]: CacheKey;
  [DexieCacheStoreTableTimestamp]: number;
  cachedValue: R;
}

export class DexieCacheStore<R extends RawCacheableValue, C extends Cacheable<R>> implements CacheStore<R, C> {
  public constructor(private readonly table: DexieCacheStoreTable<R>, private readonly cacheMaxAge: number) {}

  public async get(cacheKey: CacheKey, inflater: Inflater<R, C>) {
    return tryCatch(() => this.table.get(cacheKey), String)
      .map(fromNullable)
      .chain((record) => {
        const nowSec = Math.ceil(Date.now() / 1000);
        return record.isSome() && nowSec - record.value.cachedAt >= this.cacheMaxAge
          ? tryCatch(() => this.del(cacheKey), String).map<Option<CacheRecord<R>>>(() => none)
          : fromEither(right(record));
      })
      .map((record) => record.map((r) => inflater(r.cachedValue)))
      .run();
  }

  public async set(cacheable: C) {
    const cachedAt = Math.ceil(Date.now() / 1000);
    const record = { cacheKey: cacheable.cacheKey, cachedAt, cachedValue: cacheable.deflate() };
    return tryCatch(() => this.table.put(record), String).run();
  }

  public async del(cacheKey: CacheKey) {
    return tryCatch(() => this.table.delete(cacheKey), String).run();
  }
}
