import * as octicons from 'octicons';
import { SSOT } from '../common/ssot';
import { STATUS_DOM_ROW_ORDER } from '../constant';
import { Reviewer, ReviewResult } from '../domain/review';
import { ReviewStatus } from '../domain/review-status';
import { h } from '../util/create-element';
import { $all } from '../util/query-selector';

export class ReviewStatusColumn {
  private constructor(
    private readonly $ele: HTMLDivElement,
    public readonly props: {
      readonly reviewStatus: SSOT<ReviewStatus>;
      readonly isDisplay: SSOT<boolean>;
    },
  ) {}

  public static async mount($ele: HTMLDivElement, reviewStatus: SSOT<ReviewStatus>, isDisplay: SSOT<boolean>) {
    const self = new this($ele, { reviewStatus, isDisplay });

    self.props.reviewStatus.watchImmediately(self.render.bind(self));
    self.props.isDisplay.watchImmediately((onOrOff) => {
      self.$ele.style.display = onOrOff ? 'block' : 'none';
    });

    return self;
  }

  public static parseStatusFromDom(parent: HTMLDivElement) {
    const status = new ReviewStatus();
    for (const row of $all<HTMLDivElement>(parent, 'div')) {
      const result = row.dataset.reviewResult as ReviewResult;
      for (const img of $all<HTMLImageElement>(row, `.${USER_ICON_CLASSNAME}`)) {
        const username = img.dataset.username!;
        status.add({ result, reviewer: { name: username, iconUrl: img.src } });
      }
    }
    return status;
  }

  private render() {
    while (this.$ele.firstChild) {
      this.$ele.removeChild(this.$ele.firstChild);
    }
    for (const result of STATUS_DOM_ROW_ORDER) {
      const reviewerIcons = [...this.props.reviewStatus.value.reviewsOf(result)].map(({ reviewer }) =>
        userIcon(reviewer),
      );
      if (reviewerIcons.length === 0) {
        continue;
      }
      const row = h('div', [reviewResultIcon(result), ...reviewerIcons]);
      row.dataset.reviewResult = result;
      this.$ele.append(row);
    }
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
