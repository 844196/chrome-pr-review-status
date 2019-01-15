import { ReviewStatus as ReviewStatusColumn } from '../component/review-status';
import { ReviewStatusToggleButton } from '../component/review-status-toggle-button';
import { STATUS_DOM_CLASSNAME, TOGGLE_STATUS_BUTTON_ID } from '../constant';
import { PullRequestListRow as IPullRequestListRow } from '../domain/pr-list-row';
import { ReviewCollection } from '../domain/review';
import { h } from '../util/create-element';
import { $, $all } from '../util/query-selector';

class PullRequestListRow implements IPullRequestListRow {
  public readonly pullRequestPageUrl: string;
  private readonly reviewStatusColumn: ReviewStatusColumn;

  public constructor(private readonly dom: HTMLDivElement) {
    this.pullRequestPageUrl = $<HTMLAnchorElement>(dom, 'a.h4')!.href;

    const insertedColumnDom = $<HTMLDivElement>(this.dom, `.${STATUS_DOM_CLASSNAME}`);
    this.reviewStatusColumn = new ReviewStatusColumn(
      insertedColumnDom ||
        h('div', {
          style: {
            height: '105.312px',
          },
          class: [STATUS_DOM_CLASSNAME, 'col-2', 'p-2', 'float-left'],
        }),
    );
    if (!insertedColumnDom) {
      const title = $(this.dom, '.col-9')!;
      title.classList.replace('col-9', 'col-7');
      title.parentNode!.insertBefore(this.reviewStatusColumn.dom, title.nextSibling);
    }
  }

  public updateReviewerState(reviews: ReviewCollection) {
    this.reviewStatusColumn.fillRows(reviews);
  }

  public changeBackgroundColor(color: string) {
    this.dom.style.backgroundColor = color;
  }

  public toggleDisplayReviewStatusColumn(isDisplay: boolean) {
    this.reviewStatusColumn.isDisplay(isDisplay);
  }
}

// tslint:disable-next-line:max-classes-per-file
export class PullRequestListPage {
  public readonly loginUsername: string;
  public readonly button: ReviewStatusToggleButton;
  public readonly rows: PullRequestListRow[];

  public constructor() {
    this.loginUsername = $<HTMLMetaElement>('meta[name=user-login]')!.content;

    const insertedButtonDom = $<HTMLButtonElement>(`#${TOGGLE_STATUS_BUTTON_ID}`);
    this.button = new ReviewStatusToggleButton(
      insertedButtonDom ||
        h('button', {
          props: {
            id: TOGGLE_STATUS_BUTTON_ID,
          },
          class: ['btn', 'btn-default', 'float-right', 'mr-2'],
        }),
    );
    if (!insertedButtonDom) {
      $('.subnav')!.append(this.button.dom);
    }

    this.rows = $all<HTMLDivElement>('.js-issue-row').map((rowDom) => new PullRequestListRow(rowDom));
  }

  get alreadyProcessed() {
    const buttonState = this.button.state.value;
    return buttonState === 'awaitingHide' || buttonState === 'awaitingShow';
  }
}
