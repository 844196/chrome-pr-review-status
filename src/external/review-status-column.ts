import * as octicons from 'octicons';
import { SSOT } from '../common/ssot';
import { STATUS_DOM_ROW_ORDER } from '../constant';
import { ReviewResult } from '../domain/review';
import { ReviewStatus } from '../domain/review-status';
import { Reviewer } from '../domain/reviewer';
import { h } from '../util/create-element';
import { $all } from '../util/query-selector';

export class ReviewStatusColumn {
  public readonly reviewStatus: SSOT<ReviewStatus>;

  public constructor(public readonly dom: HTMLDivElement, pullRequestPageUrl: string) {
    const status = new ReviewStatus(pullRequestPageUrl);
    for (const row of $all<HTMLDivElement>(this.dom, 'div')) {
      const result = row.dataset.reviewResult as ReviewResult;
      for (const img of $all<HTMLImageElement>(row, `.${USER_ICON_CLASSNAME}`)) {
        const username = img.dataset.username!;
        status.push({ result, reviewer: { name: username, iconUrl: img.src } });
      }
    }

    this.reviewStatus = new SSOT(status, (newStatus) => {
      while (this.dom.firstChild) {
        this.dom.removeChild(this.dom.firstChild);
      }

      for (const result of STATUS_DOM_ROW_ORDER) {
        const reviewerIcons = newStatus[result].map(({ reviewer }) => userIcon(reviewer));
        if (reviewerIcons.length === 0) {
          continue;
        }

        const row = h('div', [reviewResultIcon(result), ...reviewerIcons]);
        row.dataset.reviewResult = result;

        this.dom.append(row);
      }
    });
  }
}

const USER_ICON_CLASSNAME = 'avatar';
const userIcon = ({ name, iconUrl }: Reviewer) => {
  const dom = h('img', {
    props: {
      src: iconUrl,
    },
    class: USER_ICON_CLASSNAME,
    style: {
      marginLeft: '2px',
      marginRight: '2px',
      width: '20px',
      height: '20px',
    },
  });
  dom.dataset.username = name;
  return dom;
};

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
