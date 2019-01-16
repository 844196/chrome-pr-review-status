import { ReviewStatusColumn } from '../component/review-status-column';
import { PullRequestListRow } from '../domain/pr-list-row';
import { isReviewStatus, ReviewCollection, ReviewStatus } from '../domain/review';
import { $ } from '../util/query-selector';
import { SSOT } from '../util/ssot';

export class PullRequestListRowImpl implements PullRequestListRow {
  public readonly pullRequestPageUrl: string;
  public readonly reviewStatusColumn: ReviewStatusColumn;
  public readonly myReviewState: SSOT<ReviewStatus>;

  public constructor(private readonly dom: HTMLDivElement, makeColumn: (rowDom: HTMLDivElement) => ReviewStatusColumn) {
    this.pullRequestPageUrl = $<HTMLAnchorElement>(this.dom, 'a.h4')!.href;

    this.reviewStatusColumn = makeColumn(this.dom);

    const parsedMyReviewState = this.dom.dataset.myReviewState;
    const myReviewState = isReviewStatus(parsedMyReviewState) ? parsedMyReviewState : 'notReviewer';
    this.myReviewState = new SSOT<ReviewStatus>(myReviewState, (state) => {
      this.dom.dataset.myReviewState = state;
    });
  }

  public updateReviewerState(reviews: ReviewCollection, myUsername: string) {
    this.reviewStatusColumn.fillRows(reviews);
    this.myReviewState.change(reviews.getStatusByReviewerName(myUsername));
  }

  public changeBackgroundColor(color: string) {
    this.dom.style.backgroundColor = color;
  }
}
