import { SSOT } from '../util/ssot';
import { PullRequestListRow } from './pr-list-row';

export interface PullRequestListPage {
  readonly loginUsername: SSOT<string>;
  readonly rows: PullRequestListRow[];
}
