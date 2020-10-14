import React from 'react';
import * as ReactDOM from 'react-dom';
import {
  INDEXED_DB_CACHE_TABLE_NAME,
  INDEXED_DB_NAME,
  INDEXED_DB_VERSION,
  ROW_BG_COLOR_MAP,
  STATUS_DOM_CLASS_NAME,
} from './constant';
import { ReviewState } from './domain/review';
import { ReviewStatus, ReviewStatusRepository } from './domain/review-status';
import { DexieCacheStore, DexieCacheStoreTable, DexieCacheStoreTableSchema } from './external/cache-store';
import { Config, useConfig } from './external/chrome';
import { GithubConnectionImpl } from './external/github';
import { ReviewStatusColumn } from './external/review-status-column';
import { select } from './util/query-selector';
import { setupDexie } from './util/setup-dexie';

const cacheTable = setupDexie<{ [INDEXED_DB_CACHE_TABLE_NAME]: DexieCacheStoreTable<ReviewStatus> }>(
  INDEXED_DB_NAME,
  INDEXED_DB_VERSION,
  {
    [INDEXED_DB_CACHE_TABLE_NAME]: DexieCacheStoreTableSchema,
  },
)[INDEXED_DB_CACHE_TABLE_NAME];
const cacheStore = new DexieCacheStore(cacheTable);
const repository = new ReviewStatusRepository(cacheStore, new GithubConnectionImpl());

const mountRow = (loginUsername: string, config: Config) => (row: HTMLDivElement) => {
  const reviewStatus = repository.findByUrl(select<HTMLAnchorElement>('a.h4', row).fold('', (a) => a.href));
  if (config.enableBackgroundColor) {
    reviewStatus.then((_) => {
      _.map((rs) => {
        const state = rs.findByReviewerName(loginUsername).fold<ReviewState>('notReviewer', ({ result }) => result);
        row.style.background = ROW_BG_COLOR_MAP[state];
      });
      return _;
    });
  }

  if (!config.isDisplayDefault) {
    return;
  }

  let reviewStatusCol = row.querySelector<HTMLDivElement>(`.${STATUS_DOM_CLASS_NAME}`);
  if (!reviewStatusCol) {
    reviewStatusCol = document.createElement('div');
    reviewStatusCol.classList.add(STATUS_DOM_CLASS_NAME, 'col-2', 'p-2', 'float-left');
    reviewStatusCol.style.height = '105.312px';

    const titleCol = row.querySelector('.pr-md-2')!;
    titleCol.classList.replace('flex-auto', 'col-6');
    titleCol.parentNode!.insertBefore(reviewStatusCol, titleCol.nextSibling);
  }

  ReactDOM.render(<ReviewStatusColumn promise={reviewStatus} />, reviewStatusCol);
};

const main = async () => {
  (await cacheStore.delExpiredAll()).fold(
    (reason) => console.error(`期限切れレビュー状況キャッシュの削除に失敗 - ${reason}`),
    (affected) => affected.map((count) => console.log(`期限切れレビュー状況キャッシュ${count}件を削除`)),
  );

  if (false === /^(?:\/[^\/]+){2}\/pulls/.test(new URL(location.href).pathname)) {
    return;
  }

  let loginUsername = '';
  const meta = document.querySelector<HTMLMetaElement>('meta[name=user-login]');
  if (meta) {
    loginUsername = meta.content;
  }

  const [isDisplayDefault] = await useConfig('isDisplayDefault');
  const [enableBackgroundColor] = await useConfig('enableBackgroundColor');
  const [cacheMaxAge] = await useConfig('cacheMaxAge');
  if (!isDisplayDefault && !enableBackgroundColor) {
    return;
  }

  cacheStore.cacheMaxAge = cacheMaxAge;

  document
    .querySelectorAll<HTMLDivElement>('.js-issue-row')
    .forEach(mountRow(loginUsername, { isDisplayDefault, enableBackgroundColor, cacheMaxAge }));
};

(() => {
  const pjaxContainer = document.querySelector('[data-pjax-container]');
  if (!pjaxContainer) {
    return;
  }

  pjaxContainer.addEventListener('pjax:end', main);
  main();
})();
