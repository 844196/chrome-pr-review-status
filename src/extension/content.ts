import {
  INDEXED_DB_CACHE_TABLE_MAX_AGE,
  INDEXED_DB_CACHE_TABLE_NAME,
  INDEXED_DB_NAME,
  INDEXED_DB_VERSION,
} from '../constant';
import { RawReviewStatus, ReviewStatus, ReviewStatusRepository } from '../domain/review-status';
import { DexieCacheStore, DexieCacheStoreTable, DexieCacheStoreTableSchema } from '../external/cache-store';
import { PullRequestListPageImpl } from '../external/pr-list-page';
import { GithubConnectionImpl } from '../external/review-status';
import { InjectReviewStatus } from '../usecase/inject-review-status';
import { setupDexie } from '../util/setup-dexie';

(async () => {
  const page = await PullRequestListPageImpl.mount(document);

  const cacheTable = setupDexie<{ [INDEXED_DB_CACHE_TABLE_NAME]: DexieCacheStoreTable<RawReviewStatus> }>(
    INDEXED_DB_NAME,
    INDEXED_DB_VERSION,
    {
      [INDEXED_DB_CACHE_TABLE_NAME]: DexieCacheStoreTableSchema,
    },
  )[INDEXED_DB_CACHE_TABLE_NAME];
  const cacheStore = new DexieCacheStore<RawReviewStatus, ReviewStatus>(cacheTable, INDEXED_DB_CACHE_TABLE_MAX_AGE);
  const repository = new ReviewStatusRepository(cacheStore, new GithubConnectionImpl());
  const usecase = new InjectReviewStatus(repository);

  await page.doInjectReviewStatus(usecase.invoke.bind(usecase));
})();
