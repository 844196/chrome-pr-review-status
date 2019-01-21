import { Either } from 'fp-ts/lib/Either';
import { Option } from 'fp-ts/lib/Option';

export type CacheKey = string;

// tslint:disable-next-line:no-empty-interface
export interface RawCacheableValue {
  // マーカインターフェイス
}

export interface Cacheable<R extends RawCacheableValue> {
  readonly cacheKey: CacheKey;
  deflate(): R;
}

export type Inflater<R extends RawCacheableValue, C extends Cacheable<R>> = (raw: R) => C;

export interface CacheStore<R extends RawCacheableValue, C extends Cacheable<R>> {
  get(cacheKey: CacheKey, inflater: Inflater<R, C>): Promise<Either<string, Option<C>>>;
  set(cacheable: C): Promise<Either<string, string>>;
  del(cacheKey: CacheKey): Promise<Either<string, void>>;
}
