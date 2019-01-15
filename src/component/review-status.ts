import { STATUS_DOM_ROW_ORDER } from '../constant';
import { ReviewCollection } from '../domain/review';
import { h } from '../util/create-element';
import { AbstractComponent } from './abstract-component';
import { icons } from './review-status-icon';
import { UserIcon } from './user-icon';

export class ReviewStatus extends AbstractComponent<HTMLDivElement> {
  public constructor(public readonly dom: HTMLDivElement) {
    super();
  }

  public isDisplay(isDisplay: boolean): this {
    this.dom.style.display = isDisplay ? 'block' : 'none';
    return this;
  }

  public fillRows(reviews: ReviewCollection) {
    while (this.dom.firstChild) {
      this.dom.removeChild(this.dom.firstChild);
    }

    const reviewersByStatus = reviews.groupingReviewerByStatus();
    for (const status of STATUS_DOM_ROW_ORDER) {
      const reviewers = reviewersByStatus[status];
      if (!reviewers) {
        continue;
      }
      const statusIcon = icons[status]().dom;
      const reviewerIcons = reviewers.map(({ iconUrl }) => new UserIcon(iconUrl).dom);
      this.dom.append(h('div', [statusIcon, ...reviewerIcons]));
    }
  }
}
