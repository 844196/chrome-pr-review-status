import {
  INDEXED_DB_CACHE_TABLE_MAX_AGE,
  INDEXED_DB_CACHE_TABLE_NAME,
  INDEXED_DB_NAME,
  INDEXED_DB_VERSION,
} from '../constant';
import { ReviewStatus, ReviewStatusRepository } from '../domain/review-status';
import { DexieCacheStore, DexieCacheStoreTable, DexieCacheStoreTableSchema } from '../external/cache-store';
import { PullRequestListPageImpl } from '../external/pr-list-page';
import { GithubConnectionImpl } from '../external/review-status';
import { InjectReviewStatus } from '../usecase/inject-review-status';
import { setupDexie } from '../util/setup-dexie';

(async () => {
  const page = await PullRequestListPageImpl.mount(document);

  const cacheTable = setupDexie<{ [INDEXED_DB_CACHE_TABLE_NAME]: DexieCacheStoreTable<ReviewStatus> }>(
    INDEXED_DB_NAME,
    INDEXED_DB_VERSION,
    {
      [INDEXED_DB_CACHE_TABLE_NAME]: DexieCacheStoreTableSchema,
    },
  )[INDEXED_DB_CACHE_TABLE_NAME];
  const cacheStore = new DexieCacheStore(cacheTable, INDEXED_DB_CACHE_TABLE_MAX_AGE);
  (await cacheStore.delExpiredAll()).fold(
    (reason) => console.error(`期限切れレビュー状況キャッシュの削除に失敗 - ${reason}`),
    (affected) => affected.map((count) => console.log(`期限切れレビュー状況キャッシュ${count}件を削除`)),
  );

  const repository = new ReviewStatusRepository(cacheStore, new GithubConnectionImpl());
  const usecase = new InjectReviewStatus(repository);

  await page.doInjectReviewStatus(usecase.invoke.bind(usecase));
})();
