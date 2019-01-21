import { ReviewResult } from './domain/review';
import { ReviewState } from './domain/review-state';

export const STATUS_DOM_ROW_ORDER: ReviewResult[] = ['approved', 'requestedChanges', 'leftComments', 'unreviewed'];

export const ROW_BG_COLOR_MAP: { [_ in ReviewState]: string } = {
  notReviewer: 'inherit',
  unreviewed: '#f3f3b9',
  approved: '#b9f3d2',
  leftComments: '#e2e2e2',
  requestedChanges: '#f3b9b9',
};

export const STATUS_DOM_CLASSNAME = 'review-status';

export const TOGGLE_STATUS_BUTTON_ID = 'status-display-toggle-btn';

export const INDEXED_DB_NAME = 'chrome-pr-review-status';

export const INDEXED_DB_VERSION = 1;

export const INDEXED_DB_CACHE_TABLE_NAME = 'cachedReviewStatus';

export const INDEXED_DB_CACHE_TABLE_MAX_AGE = 60;
