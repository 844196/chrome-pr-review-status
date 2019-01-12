import * as Config from '../external/config';
import { ReviewStatusInjector } from '../review-status-injector';
import { $ } from '../util/query-selector';

const injector = new ReviewStatusInjector({
  username: Promise.resolve(`@${$<HTMLMetaElement>('meta[name=user-login]')!.content}`),
  isDisplayDefault: Config.get('isDisplayDefault'),
  enableBackgroundColor: Config.get('enableBackgroundColor'),
});

if (injector.needProcess()) {
  injector.invoke();
}
