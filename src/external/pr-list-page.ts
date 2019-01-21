import { SSOT } from '../common/ssot';
import { STATUS_DOM_CLASSNAME, TOGGLE_STATUS_BUTTON_ID } from '../constant';
import { PullRequestListPage } from '../domain/pr-list-page';
import { store } from '../store/store';
import { h } from '../util/create-element';
import { select, selectAll } from '../util/query-selector';
import { PullRequestListRowImpl } from './pr-list-row';
import { ReviewStatusColumnToggleButton } from './review-status-column-toggle-button';

export class PullRequestListPageImpl implements PullRequestListPage {
  private constructor(
    private readonly button: ReviewStatusColumnToggleButton,
    public readonly rows: PullRequestListRowImpl[],
    public readonly isAlreadyProcessed: boolean,
  ) {}

  public static async mount(doc: Document) {
    select<HTMLMetaElement>('meta[name=user-login]', doc).map(async ($meta) => {
      (await store.loginUsername).change($meta.content);
    });

    const [button, isAlreadyProcessed] = await makeButton(doc);
    const rows = await makeRows(doc);

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

const makeButton = async (doc: Document): Promise<[ReviewStatusColumnToggleButton, boolean]> => {
  const insertedDom = select<HTMLButtonElement>(`#${TOGGLE_STATUS_BUTTON_ID}`, doc);
  const isInserted = insertedDom.isSome();

  const buttonDom = insertedDom.getOrElseL(() => {
    const btn = h('button', {
      props: {
        id: TOGGLE_STATUS_BUTTON_ID,
      },
      class: ['btn', 'btn-default', 'float-right', 'mr-2'],
    });
    select('.subnav', doc).map(($nav) => $nav.append(btn));
    return btn;
  });

  return [await ReviewStatusColumnToggleButton.mount(buttonDom), isInserted];
};

const makeRow = async (rowDom: HTMLDivElement) => {
  const title = select('.col-9', rowDom);
  const insertedColumnDom = select(`.${STATUS_DOM_CLASSNAME}`, rowDom);

  if (title.isSome() && insertedColumnDom.isNone()) {
    const columnDom = h('div', {
      style: {
        height: '105.312px',
      },
      class: [STATUS_DOM_CLASSNAME, 'col-2', 'p-2', 'float-left'],
    });
    title.value.classList.replace('col-9', 'col-7');
    title.value.parentNode!.insertBefore(columnDom, title.value.nextSibling);
  }

  return await PullRequestListRowImpl.mount(rowDom);
};

const makeRows = async (doc: Document) => {
  return await Promise.all(selectAll<HTMLDivElement>('.js-issue-row', doc).map(makeRow));
};
