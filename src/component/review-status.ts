import { STATUS_DOM_ROW_ORDER } from '../constant';
import { ReviewCollection } from '../domain/review';
import { AbstractComponent } from './abstract-component';
import { icons } from './review-status-icon';
import { UserIcon } from './user-icon';

export class ReviewStatus extends AbstractComponent<HTMLDivElement> {
  public readonly dom: HTMLDivElement = document.createElement('div');

  public constructor() {
    super();
  }

  public isDisplay(isDisplay: boolean): this {
    this.dom.style.display = isDisplay ? 'block' : 'none';
    return this;
  }

  public fillRows(reviews: ReviewCollection) {
    const reviewersByStatus = reviews.groupingReviewerByStatus();
    for (const status of STATUS_DOM_ROW_ORDER) {
      const reviewers = reviewersByStatus[status];
      if (!reviewers) {
        continue;
      }
      const statusIcon = icons[status]().dom;
      const reviewerIcons = reviewers.map(({ iconUrl }) => new UserIcon(iconUrl).dom);
      const row = document.createElement('div');
      row.append(statusIcon, ...reviewerIcons);
      this.dom.append(row);
    }
  }
}
