import { STATUS_DOM_ROW_ORDER } from '../constant';
import { ReviewCollection } from '../domain/review';
import { AbstractComponent } from './abstract-component';
import * as Avatar from './avatar';
import { icons } from './icon';

export class ReviewStatus extends AbstractComponent<HTMLDivElement> {
  public readonly dom: HTMLDivElement = document.createElement('div');

  public constructor() {
    super();
  }

  public setHeight(height: string): this {
    this.dom.style.height = height;
    return this;
  }

  public isDisplay(isDisplay: boolean): this {
    this.dom.style.display = isDisplay ? 'block' : 'none';
    return this;
  }

  public fillRows(reviews: ReviewCollection) {
    const reviewersByStatus = reviews.groupingReviewerByStatus();
    for (const status of STATUS_DOM_ROW_ORDER) {
      const reviewers = reviewersByStatus[status];
      if (reviewers) {
        this.dom.append(this.makeRow(icons[status](), reviewers.map(({ iconUrl }) => iconUrl)));
      }
    }
  }

  private makeRow(statusIcon: Element, reviewersIconUrls: string[]) {
    const row = document.createElement('div');
    row.append(statusIcon, ...reviewersIconUrls.map((url) => Avatar.generate(url)));
    return row;
  }
}
