import * as octicons from 'octicons';
import { STATUS_DOM_ROW_ORDER } from '../constant';
import { ReviewResult } from '../domain/review';
import { ReviewStatus } from '../domain/review-status';
import { h } from '../util/create-element';

export class ReviewStatusColumn {
  public constructor(public readonly dom: HTMLDivElement) {}

  public update(status: ReviewStatus) {
    while (this.dom.firstChild) {
      this.dom.removeChild(this.dom.firstChild);
    }
    for (const result of STATUS_DOM_ROW_ORDER) {
      const reviewerIcons = status[result].map((review) => userIcon(review.reviewer.iconUrl));
      if (reviewerIcons.length === 0) {
        continue;
      }
      this.dom.append(h('div', [reviewResultIcon(result), ...reviewerIcons]));
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

const reviewResultIcon = (result: ReviewResult) => {
  const { svg, colorClass } = resultIconMap[result];
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

const resultIconMap: {
  [P in ReviewResult]: {
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
