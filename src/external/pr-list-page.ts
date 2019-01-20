import { SSOT } from '../common/ssot';
import { STATUS_DOM_CLASSNAME, TOGGLE_STATUS_BUTTON_ID } from '../constant';
import { PullRequestListPage } from '../domain/pr-list-page';
import { store } from '../store/store';
import { h } from '../util/create-element';
import { $, $all } from '../util/query-selector';
import { PullRequestListRowImpl } from './pr-list-row';
import { ReviewStatusColumnToggleButton } from './review-status-column-toggle-button';

export class PullRequestListPageImpl implements PullRequestListPage {
  private constructor(
    private readonly button: ReviewStatusColumnToggleButton,
    public readonly rows: PullRequestListRowImpl[],
    public readonly isAlreadyProcessed: boolean,
  ) {}

  public static async mount() {
    (await store.loginUsername).change($<HTMLMetaElement>('meta[name=user-login]')!.content);

    const [button, isAlreadyProcessed] = await makeButton();
    const rows = await makeRows();

    return new this(button, rows, isAlreadyProcessed);
  }

  public async doInjectReviewStatus(func: (page: PullRequestListPage, progress: SSOT<number>) => Promise<void>) {
    this.button.$data.progress.max.change(this.rows.length);
    const progress = new SSOT(0, (done) => this.button.$data.progress.value.change(done));

    this.button.$data.state.change('displayProgress');
    await func(this, progress);

    this.button.$data.state.change('awaitingClick');
  }
}

const makeButton = async (): Promise<[ReviewStatusColumnToggleButton, boolean]> => {
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

  return [await ReviewStatusColumnToggleButton.mount(buttonDom), insertedDom !== null];
};

const makeRow = async (rowDom: HTMLDivElement) => {
  const insertedDom = $<HTMLDivElement>(rowDom, `.${STATUS_DOM_CLASSNAME}`);
  if (!insertedDom) {
    const columnDom = h('div', {
      style: {
        height: '105.312px',
      },
      class: [STATUS_DOM_CLASSNAME, 'col-2', 'p-2', 'float-left'],
    });
    const title = $(rowDom, '.col-9')!;
    title.classList.replace('col-9', 'col-7');
    title.parentNode!.insertBefore(columnDom, title.nextSibling);
  }

  return await PullRequestListRowImpl.mount(rowDom);
};

const makeRows = async () => {
  return await Promise.all($all<HTMLDivElement>('.js-issue-row').map(makeRow));
};
