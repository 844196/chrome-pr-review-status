import { SSOT } from '../common/ssot';
import { ROW_BG_COLOR_MAP } from '../constant';
import { PullRequestListRow } from '../domain/pr-list-row';
import { isMyReviewState, MyReviewState, ReviewCollection } from '../domain/review';
import { $ } from '../util/query-selector';
import { ReviewStatusColumn } from './review-status-column';

export class PullRequestListRowImpl implements PullRequestListRow {
  public readonly pullRequestPageUrl: string;
  public readonly reviewStatusColumn: ReviewStatusColumn;
  public readonly enableBackgroundColor = new SSOT(true);
  private readonly myReviewState: SSOT<MyReviewState>;

  public constructor(
    private readonly dom: HTMLDivElement,
    makeColumn: (rowDom: HTMLDivElement, pullRequestPageUrl: string) => ReviewStatusColumn,
  ) {
    this.pullRequestPageUrl = $<HTMLAnchorElement>(this.dom, 'a.h4')!.href;

    this.reviewStatusColumn = makeColumn(this.dom, this.pullRequestPageUrl);

    const parsedMyReviewState = this.dom.dataset.myReviewState;
    const myReviewState = isMyReviewState(parsedMyReviewState) ? parsedMyReviewState : 'notReviewer';
    this.myReviewState = new SSOT<MyReviewState>(myReviewState, (state) => {
      this.dom.dataset.myReviewState = state;
    });

    this.myReviewState.onChange(this.updateBackgroundColor.bind(this));
    this.enableBackgroundColor.onChange(this.updateBackgroundColor.bind(this));
  }

  public updateReviewStatusColumn(reviews: ReviewCollection) {
    this.reviewStatusColumn.reviewStatus.change(reviews.toReviewStatus(this.pullRequestPageUrl));
  }

  public updateMyReviewState(myUsername: string) {
    const state = this.reviewStatusColumn.reviewStatus.value
      .findByUsername(myUsername)
      .fold<MyReviewState>('notReviewer', ({ result }) => result);
    this.myReviewState.change(state);
  }

  private updateBackgroundColor() {
    this.dom.style.backgroundColor = this.enableBackgroundColor.value
      ? ROW_BG_COLOR_MAP[this.myReviewState.value]
      : 'inherit';
  }
}
