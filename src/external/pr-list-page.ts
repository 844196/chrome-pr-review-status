import { SSOT } from '../common/ssot';
import { STATUS_DOM_CLASSNAME, TOGGLE_STATUS_BUTTON_ID } from '../constant';
import { PullRequestListPage } from '../domain/pr-list-page';
import { h } from '../util/create-element';
import { $, $all } from '../util/query-selector';
import { PullRequestListRowImpl } from './pr-list-row';
import { ReviewStatusColumn } from './review-status-column';
import { ReviewStatusColumnToggleButton } from './review-status-column-toggle-button';

export class PullRequestListPageImpl implements PullRequestListPage {
  public readonly loginUsername: SSOT<string>;
  public readonly button: ReviewStatusColumnToggleButton;
  public readonly rows: PullRequestListRowImpl[];

  public constructor(
    public readonly isDisplayReviewStatusColumn: SSOT<boolean>,
    public readonly colorCoded: SSOT<boolean>,
    debugUsername: SSOT<string>,
  ) {
    const originLoginUsername = $<HTMLMetaElement>('meta[name=user-login]')!.content;
    this.loginUsername = new SSOT(originLoginUsername);
    if (ENVIRONMENT === 'development') {
      debugUsername.onChangeWithRun((changed) => {
        this.loginUsername.change(changed === '' ? originLoginUsername : changed);
      });
    }
    this.button = makeButton(this.isDisplayReviewStatusColumn);
    this.rows = makeRows(this.isDisplayReviewStatusColumn, this.colorCoded, this.loginUsername);
  }

  get alreadyProcessed() {
    return this.button.isAwaitClick;
  }

  public async doInjectReviewStatus(func: (page: PullRequestListPage, progress: SSOT<number>) => Promise<void>) {
    const progress = new SSOT(0, (done) => this.button.updateProgress(done, this.rows.length));
    this.button.fetchStart();
    await func(this, progress);
    this.button.fetchComplete(this.isDisplayReviewStatusColumn.value);
  }
}

const makeButton = (isDisplayReviewStatusColumn: SSOT<boolean>) => {
  const insertedDom = $<HTMLButtonElement>(`#${TOGGLE_STATUS_BUTTON_ID}`);
  const buttonDom =
    insertedDom ||
    h('button', {
      props: {
        id: TOGGLE_STATUS_BUTTON_ID,
      },
      class: ['btn', 'btn-default', 'float-right', 'mr-2'],
    });

  if (!insertedDom) {
    $('.subnav')!.append(buttonDom);
  }

  const button = new ReviewStatusColumnToggleButton(buttonDom);

  button.click.on((isDisplay) => isDisplayReviewStatusColumn.change(isDisplay));
  isDisplayReviewStatusColumn.onChangeWithRun((isDisplay) => {
    if (button.isAwaitClick) {
      button.changeStateByIsDisplay(isDisplay);
    }
  });

  return button;
};

const makeColumn = (isDisplayReviewStatusColumn: SSOT<boolean>) => (
  rowDom: HTMLDivElement,
  pullRequestPageUrl: string,
) => {
  const insertedDom = $<HTMLDivElement>(rowDom, `.${STATUS_DOM_CLASSNAME}`);
  const columnDom =
    insertedDom ||
    h('div', {
      style: {
        height: '105.312px',
      },
      class: [STATUS_DOM_CLASSNAME, 'col-2', 'p-2', 'float-left'],
    });

  isDisplayReviewStatusColumn.onChangeWithRun((isDisplay) => {
    columnDom.style.display = isDisplay ? 'block' : 'none';
  });

  if (!insertedDom) {
    const title = $(rowDom, '.col-9')!;
    title.classList.replace('col-9', 'col-7');
    title.parentNode!.insertBefore(columnDom, title.nextSibling);
  }

  return new ReviewStatusColumn(columnDom, pullRequestPageUrl);
};

const makeRow = (
  makeColumnFunc: ReturnType<typeof makeColumn>,
  colorCoded: SSOT<boolean>,
  loginUsername: SSOT<string>,
) => (rowDom: HTMLDivElement) => {
  const row = new PullRequestListRowImpl(rowDom, makeColumnFunc);
  colorCoded.pipeWithEmit(row.enableBackgroundColor);
  loginUsername.onChangeWithRun(row.updateMyReviewState.bind(row));
  return row;
};

const makeRows = (
  isDisplayReviewStatusColumn: SSOT<boolean>,
  colorCoded: SSOT<boolean>,
  loginUsername: SSOT<string>,
) => {
  const makeColumnFunc = makeColumn(isDisplayReviewStatusColumn);
  const makeRowFunc = makeRow(makeColumnFunc, colorCoded, loginUsername);
  return $all<HTMLDivElement>('.js-issue-row').map(makeRowFunc);
};
