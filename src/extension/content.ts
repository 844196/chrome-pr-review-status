import { ToggleStatusButton } from '../component/toggle-status-button';
import { STATUS_DOM_CLASSNAME, TOGGLE_STATUS_BUTTON_ID } from '../constant';
import * as Config from '../external/config';
import { GithubIssueListRow, ReviewStatusInjector } from '../review-status-injector';
import { $, $all } from '../util/query-selector';

const isDisplayDefault = Config.get('isDisplayDefault');
const enableBackgroundColor = Config.get('enableBackgroundColor');

const username = Promise.resolve(`@${$<HTMLMetaElement>('meta[name=user-login]')!.content}`);

const listRows = $all<HTMLDivElement>('.js-issue-row').map<GithubIssueListRow>((row) => {
  return {
    pullRequestPageUrl: $<HTMLAnchorElement>(row, 'a.h4')!.href,
    insertReviewStatusColumn(status) {
      status.setHeight('105.312px').addClass('col-2', 'p-2', 'float-left');
      const insertedStatusDom = $(row, `.${STATUS_DOM_CLASSNAME}`);
      if (insertedStatusDom) {
        insertedStatusDom.parentNode!.replaceChild(status.dom, insertedStatusDom);
      } else {
        const title = $(row, '.col-9')!;
        title.classList.replace('col-9', 'col-7');
        title.parentNode!.insertBefore(status.dom, title.nextSibling);
      }
    },
    changeBackgroundColor(color) {
      row.style.backgroundColor = color;
    },
  };
});

const insertedToggleButtonDom = $<HTMLButtonElement>(`#${TOGGLE_STATUS_BUTTON_ID}`);
let toggleButton: ToggleStatusButton;
if (insertedToggleButtonDom) {
  toggleButton = ToggleStatusButton.fromDom(insertedToggleButtonDom);
} else {
  toggleButton = ToggleStatusButton.make('fetching').addClass('btn', 'btn-default', 'float-right', 'mr-2');
  $('.subnav')!.append(toggleButton.dom);
}

const injector = new ReviewStatusInjector({
  username,
  listRows,
  toggleButton,
  isDisplayDefault,
  enableBackgroundColor,
});

const isFirstRender = insertedToggleButtonDom === null;
const isFetchIncompleted = toggleButton.state === 'fetching';
if (isFirstRender || isFetchIncompleted) {
  injector.invoke();
}
