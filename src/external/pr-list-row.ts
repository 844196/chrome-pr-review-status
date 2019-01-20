import { SSOT } from '../common/ssot';
import { ROW_BG_COLOR_MAP, STATUS_DOM_CLASSNAME } from '../constant';
import { PullRequestListRow } from '../domain/pr-list-row';
import { reviewState, ReviewState } from '../domain/review-state';
import { ReviewStatus } from '../domain/review-status';
import { store } from '../store/store';
import { $ } from '../util/query-selector';
import { ReviewStatusColumn } from './review-status-column';

export class PullRequestListRowImpl implements PullRequestListRow {
  private constructor(
    private readonly $ele: HTMLDivElement,
    public readonly $props: {
      readonly reviewStatus: SSOT<ReviewStatus>;
    },
    private readonly $data: {
      readonly myReviewState: SSOT<ReviewState>;
    },
  ) {}

  get pullRequestPageUrl() {
    return $<HTMLAnchorElement>(this.$ele, 'a.h4')!.href;
  }

  public static async mount($ele: HTMLDivElement) {
    const columnDom = $<HTMLDivElement>($ele, `.${STATUS_DOM_CLASSNAME}`)!;
    const reviewStatus = new SSOT(ReviewStatusColumn.parseStatusFromDom(columnDom));
    await ReviewStatusColumn.mount(columnDom, reviewStatus, await store.isDisplayReviewStatusColumn);

    const props = { reviewStatus };
    const data = {
      myReviewState: new SSOT(reviewState($ele.dataset.myReviewState).getOrElse('notReviewer')).onChange((changed) => {
        $ele.dataset.myReviewState = changed;
      }),
    };

    const self = new this($ele, props, data);

    self.$props.reviewStatus.onChange(self.computeMyReviewState.bind(self));
    (await store.loginUsername).onChange(self.computeMyReviewState.bind(self));
    self.$data.myReviewState.onChange(self.updateBackgroundColor.bind(self));
    (await store.colorCoded).onChange(self.updateBackgroundColor.bind(self));

    await self.computeMyReviewState();

    return self;
  }

  private async computeMyReviewState() {
    const computed = this.$props.reviewStatus.value
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
