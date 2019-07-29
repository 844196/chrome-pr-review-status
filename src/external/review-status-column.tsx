import { React } from 'dom-chef/react';
import * as octicons from 'octicons';
import { SSOT } from '../common/ssot';
import { STATUS_DOM_ROW_ORDER } from '../constant';
import { Reviewer, ReviewResult } from '../domain/review';
import { ReviewStatus } from '../domain/review-status';

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
      $ele.style.display = onOrOff ? 'block' : 'none';
    });
    return self;
  }

  private render() {
    while (this.$ele.firstChild) {
      this.$ele.removeChild(this.$ele.firstChild);
    }
    for (const result of STATUS_DOM_ROW_ORDER) {
      const reviewerIcons = [...this.props.reviewStatus.value.reviewsOf(result)]
        .map((review) => review.reviewer)
        .map(userIcon);
      if (reviewerIcons.length === 0) {
        continue;
      }
      this.$ele.append((
        <div>
          {reviewResultIcon(result)}
          {reviewerIcons}
        </div>
      ) as any);
    }
  }
}

const USER_ICON_CLASSNAME = 'avatar';
const userIcon = ({ iconUrl }: Reviewer) => {
  return (
    <img
      src={iconUrl}
      className={USER_ICON_CLASSNAME}
      style={{ marginLeft: '2px', marginRight: '2px', width: '20px', height: '20px' }}
    />
  );
};

const reviewResultIcon = (result: ReviewResult) => {
  const { svg, colorClass } = resultIconMap[result];
  return (
    <span
      dangerouslySetInnerHTML={{ __html: svg }}
      className={colorClass}
      style={{ display: 'inline-block', textAlign: 'center', verticalAlign: 'middle', width: '20px', height: '20px' }}
    />
  );
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
