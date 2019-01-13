import { ReviewStatus } from './domain/review';

export const ROW_BG_COLOR_MAP: { [_ in Exclude<ReviewStatus, 'not reviewer'>]: string } = {
  unreviewed: '#f3f3b9',
  approved: '#b9f3d2',
  leftComments: '#e2e2e2',
  requestedChanges: '#f3b9b9',
};
export const STATUS_DOM_CLASSNAME = 'review-status';
export const TOGGLE_STATUS_BUTTON_ID = 'status-display-toggle-btn';
export const STATUS_DOM_ROW_ORDER: ReviewStatus[] = ['approved', 'requestedChanges', 'leftComments', 'unreviewed'];
