import * as octicons from 'octicons';
import { STATUS_DOM_ROW_ORDER } from '../constant';
import { ReviewCollection, ReviewStatus } from '../domain/review';
import { h } from '../util/create-element';

export class ReviewStatusColumn {
  public constructor(public readonly dom: HTMLDivElement) {}

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
      this.dom.append(h('div', [statusIcon(status), ...reviewers.map(({ iconUrl }) => userIcon(iconUrl))]));
    }
  }
}

const userIcon = (src: string) =>
  h('img', {
    props: {
      src,
    },
    class: 'avatar',
    style: {
      marginLeft: '2px',
      marginRight: '2px',
      width: '20px',
      height: '20px',
    },
  });

const statusIcon = (status: Exclude<ReviewStatus, 'notReviewer'>) => {
  const { svg, colorClass } = statusIconMap[status];
  return h('span', {
    props: {
      innerHTML: svg,
    },
    class: colorClass,
    style: {
      display: 'inline-block',
      textAlign: 'center',
      verticalAlign: 'middle',
      width: '20px',
      height: '20px',
    },
  });
};

const statusIconMap: {
  [P in Exclude<ReviewStatus, 'notReviewer'>]: {
    svg: string;
    colorClass: string;
  }
} = {
  leftComments: {
    svg: octicons.comment.toSVG(),
    colorClass: 'text-gray',
  },
  requestedChanges: {
    svg: octicons.x.toSVG(),
    colorClass: 'text-red',
  },
  approved: {
    svg: octicons.check.toSVG(),
    colorClass: 'text-green',
  },
  unreviewed: {
    svg: octicons['primitive-dot'].toSVG(),
    colorClass: 'bg-pending',
  },
};
