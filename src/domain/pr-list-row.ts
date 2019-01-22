import { SSOT } from '../common/ssot';
import { ReviewStatus } from './review-status';

export interface PullRequestListRow {
  readonly pullRequestPageUrl: string;
  readonly $data: {
    readonly reviewStatus: SSOT<ReviewStatus>;
  };
}
