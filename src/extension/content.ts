import { ToggleStatusButton } from '../component/toggle-status-button';
import { STATUS_DOM_CLASSNAME, TOGGLE_STATUS_BUTTON_ID } from '../constant';
import * as Config from '../external/config';
import { GithubIssueListRow, ReviewStatusInjector } from '../review-status-injector';
import { $, $all } from '../util/query-selector';
import { SSOT } from '../util/ssot';

const isDisplayDefault = Config.get('isDisplayDefault');
const enableBackgroundColor = Config.get('enableBackgroundColor');

const loginUsername = $<HTMLMetaElement>('meta[name=user-login]')!.content;
const username =
  ENVIRONMENT === 'development'
    ? Config.get('debugUsername').then((debugUsername) => (debugUsername === '' ? loginUsername : debugUsername))
    : Promise.resolve(loginUsername);

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

const injectionProgress = new SSOT(0);

const injector = new ReviewStatusInjector({
  username,
  listRows,
  isDisplayDefault,
  enableBackgroundColor,
  injectionProgress,
});

injectionProgress.onChange((progress) => {
  toggleButton.updateFetchProgress(progress, listRows.length);
});
injector.state.onChange(async (state) => {
  if (state === 'done') {
    toggleButton.changeState((await isDisplayDefault) ? 'awaitingHide' : 'awaitingShow');
  }
});

const isFirstRender = insertedToggleButtonDom === null;
const isFetchIncompleted = toggleButton.state === 'fetching';
if (isFirstRender || isFetchIncompleted) {
  injector.invoke();
}
