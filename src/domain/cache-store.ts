import { Either } from 'fp-ts/lib/Either';
import { Option } from 'fp-ts/lib/Option';

type CacheKey = string | number;

// tslint:disable-next-line:no-empty-interface
interface CacheableJSON {
  // マーカインターフェイス
}

export interface Cacheable<J extends CacheableJSON> {
  readonly cacheKey: CacheKey;
  toJSON(): J;
}

export type Inflater<C extends Cacheable<any>> = (json: ReturnType<C['toJSON']>) => C;

export interface CacheStore<C extends Cacheable<any>> {
  get(cacheKey: C['cacheKey'], inflater: Inflater<C>): Promise<Either<string, Option<C>>>;
  set(cacheable: C): Promise<Either<string, C['cacheKey']>>;
  del(cacheKey: C['cacheKey']): Promise<Either<string, void>>;
}
