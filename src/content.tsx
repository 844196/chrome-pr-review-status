import React, { ReactPortal } from 'react';
import * as ReactDOM from 'react-dom';
import { ReviewStatusContainer } from './components/ecosystems/ReviewStatusContainer';
import { ExtensionContent } from './components/environments/ExtensionContent';

const main = () => {
  if (false === /^(?:\/[^\/]+){2}\/pulls/.test(new URL(location.href).pathname)) {
    return;
  }

  const portals: ReactPortal[] = [];
  document.querySelectorAll<HTMLDivElement>('.js-issue-row').forEach((row$) => {
    const prUrl = (row$.querySelector<HTMLAnchorElement>('a.h4') || document.createElement('a')).href;

    let el$ = row$.querySelector<HTMLDivElement>('.review-status');
    if (!el$) {
      el$ = document.createElement('div');
      el$.classList.add('review-status', 'col-2', 'p-2', 'float-left');
      el$.style.height = '128px';

      const t = row$.querySelector('.pr-md-2')!;
      t.classList.replace('flex-auto', 'col-6');
      t.parentNode!.insertBefore(el$, t.nextSibling);
    }

    portals.push(ReactDOM.createPortal(<ReviewStatusContainer prUrl={prUrl} row$={row$} />, el$));
  });

  ReactDOM.render(<ExtensionContent portals={portals} />, document.createElement('div'));
};

const pjaxContainer = document.querySelector('[data-pjax-container]');
if (pjaxContainer) {
  pjaxContainer.addEventListener('pjax:end', main);
}

main();
