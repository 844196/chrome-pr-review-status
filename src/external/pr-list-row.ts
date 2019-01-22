import { SSOT } from '../common/ssot';
import { ROW_BG_COLOR_MAP, STATUS_DOM_CLASSNAME } from '../constant';
import { PullRequestListRow } from '../domain/pr-list-row';
import { ReviewState } from '../domain/review';
import { ReviewStatus } from '../domain/review-status';
import { store } from '../store/store';
import { $ } from '../util/query-selector';
import { ReviewStatusColumn } from './review-status-column';

export class PullRequestListRowImpl implements PullRequestListRow {
  private constructor(
    private readonly $ele: HTMLDivElement,
    public readonly $data: {
      readonly reviewStatus: SSOT<ReviewStatus>;
      readonly myReviewState: SSOT<ReviewState>;
    },
  ) {}

  get pullRequestPageUrl() {
    return $<HTMLAnchorElement>(this.$ele, 'a.h4')!.href;
  }

  public static async mount($ele: HTMLDivElement) {
    const columnDom = $<HTMLDivElement>($ele, `.${STATUS_DOM_CLASSNAME}`)!;
    const reviewStatus = new SSOT(new ReviewStatus(''));
    await ReviewStatusColumn.mount(columnDom, reviewStatus, await store.isDisplayReviewStatusColumn);

    const data = {
      reviewStatus,
      myReviewState: new SSOT<ReviewState>('notReviewer'),
    };

    const self = new this($ele, data);

    self.$data.reviewStatus.watch(self.computeMyReviewState.bind(self));
    (await store.loginUsername).watch(self.computeMyReviewState.bind(self));
    self.$data.myReviewState.watch(self.updateBackgroundColor.bind(self));
    (await store.colorCoded).watch(self.updateBackgroundColor.bind(self));

    await self.computeMyReviewState();

    return self;
  }

  private async computeMyReviewState() {
    const computed = this.$data.reviewStatus.value
      .findByReviewerName((await store.loginUsername).value)
      .fold<ReviewState>('notReviewer', ({ result }) => result);
    this.$data.myReviewState.change(computed);
  }

  private async updateBackgroundColor() {
    this.$ele.style.backgroundColor = (await store.colorCoded).value
      ? ROW_BG_COLOR_MAP[this.$data.myReviewState.value]
      : 'inherit';
  }
}
