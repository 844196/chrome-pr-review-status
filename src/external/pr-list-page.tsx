import { React } from 'dom-chef/react';
import { SSOT } from '../common/ssot';
import { STATUS_DOM_CLASS_NAME, TOGGLE_STATUS_BUTTON_ID } from '../constant';
import { PullRequestListPage } from '../domain/pr-list-page';
import { store } from '../store/store';
import { select, selectAll } from '../util/query-selector';
import { PullRequestListRowImpl } from './pr-list-row';
import { ReviewStatusColumnToggleButton } from './review-status-column-toggle-button';

export class PullRequestListPageImpl implements PullRequestListPage {
  private constructor(
    private readonly button: ReviewStatusColumnToggleButton,
    public readonly rows: PullRequestListRowImpl[],
  ) {}

  public static async mount(doc: Document) {
    select<HTMLMetaElement>('meta[name=user-login]', doc).map(async ($meta) => {
      (await store.loginUsername).change($meta.content);
    });

    const button = await makeButton(doc);
    const rows = await makeRows(doc);

    return new this(button, rows);
  }

  public async doInjectReviewStatus(func: (page: PullRequestListPage, progress: SSOT<number>) => Promise<void>) {
    this.button.$data.progress.max.change(this.rows.length);
    const progress = new SSOT(0, (done) => this.button.$data.progress.value.change(done));

    this.button.$data.state.change('displayProgress');
    await func(this, progress);

    this.button.$data.state.change('awaitingClick');
  }
}

const makeButton = async (doc: Document): Promise<ReviewStatusColumnToggleButton> => {
  const buttonDom = select<HTMLButtonElement>(`#${TOGGLE_STATUS_BUTTON_ID}`, doc).getOrElseL(() => {
    const btn = (
      <button id={TOGGLE_STATUS_BUTTON_ID} className={['btn', 'btn-default', 'float-right', 'mr-2'].join(' ')} />
    );
    select('.subnav', doc).map(($nav) => $nav.append(btn as any));
    return (btn as any) as HTMLButtonElement;
  });

  return await ReviewStatusColumnToggleButton.mount(buttonDom);
};

const makeRow = async (rowDom: HTMLDivElement) => {
  const title = select('.col-8', rowDom);
  const insertedColumnDom = select(`.${STATUS_DOM_CLASS_NAME}`, rowDom);

  if (title.isSome() && insertedColumnDom.isNone()) {
    const columnDom = (
      <div
        className={[STATUS_DOM_CLASS_NAME, 'col-2', 'p-2', 'float-left'].join(' ')}
        style={{ height: '105.312px' }}
      />
    );
    title.value.classList.replace('col-8', 'col-6');
    title.value.parentNode!.insertBefore(columnDom as any, title.value.nextSibling);
  }

  return await PullRequestListRowImpl.mount(rowDom);
};

const makeRows = async (doc: Document) => {
  return await Promise.all(selectAll<HTMLDivElement>('.js-issue-row', doc).map(makeRow));
};
