import CircularProgress from '@material-ui/core/CircularProgress';
import grey from '@material-ui/core/colors/grey';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import Octicon, { Check, Comment, Icon, PrimitiveDot, RequestChanges, X } from '@primer/octicons-react';
import { Either } from 'fp-ts/lib/Either';
import React from 'react';
import { STATUS_DOM_ROW_ORDER } from '../constant';
import { Reviewer, ReviewResult } from '../domain/review';
import { ReviewStatus } from '../domain/review-status';

const theme = createMuiTheme({
  palette: {
    primary: grey,
  },
});

export class ReviewStatusColumn extends React.Component<
  { promise: Promise<Either<string, ReviewStatus>> },
  { loading: boolean; data?: Either<string, ReviewStatus> }
> {
  public constructor(props: any) {
    super(props);
    this.state = {
      loading: true,
      data: undefined,
    };
  }

  public componentDidMount() {
    this.resolve();
  }

  public render() {
    if (this.state.loading) {
      return (
        <div style={{ height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <MuiThemeProvider theme={theme}>
            <CircularProgress />
          </MuiThemeProvider>
        </div>
      );
    }

    const reviewStatus = this.state.data!;
    if (reviewStatus.isLeft()) {
      return <div>Error: {reviewStatus.value}</div>;
    }

    return <InnerReviewStatusColumn reviewStatus={reviewStatus.value} />;
  }

  private async resolve() {
    try {
      const data = await this.props.promise;
      this.setState({ loading: false, data });
    } catch (e) {
      console.error(e);
    }
  }
}

const InnerReviewStatusColumn: React.FC<{ reviewStatus: ReviewStatus }> = ({ reviewStatus }) => {
  if (reviewStatus.allReviewers().length === 0) {
    return <span style={{ color: '#586069', fontSize: '12px' }}>No reviews</span>;
  }

  const es = [];
  for (const reviewResult of STATUS_DOM_ROW_ORDER) {
    const reviewers = [...reviewStatus.reviewsOf(reviewResult)].map(({ reviewer }) => (
      <ReviewerIcon reviewer={reviewer} key={reviewer.name} />
    ));

    if (reviewers.length === 0) {
      continue;
    }

    es.push(
      <div key={reviewResult}>
        <ReviewResultIcon reviewResult={reviewResult} />
        {reviewers}
      </div>,
    );
  }

  return <React.Fragment>{es}</React.Fragment>;
};

const ReviewerIcon: React.FC<{ reviewer: Reviewer }> = ({ reviewer }) => (
  <img
    src={reviewer.iconUrl}
    className="avatar"
    style={{
      marginLeft: '2px',
      marginRight: '2px',
      width: '20px',
      height: '20px',
    }}
  />
);

const ReviewResultIcon: React.FC<{ reviewResult: ReviewResult }> = ({ reviewResult }) => {
  let icon: Icon;
  let colorClass: string;
  switch (reviewResult) {
    case 'leftComments':
      icon = Comment;
      colorClass = 'text-gray';
      break;
    case 'requestedChanges':
      icon = X;
      colorClass = 'text-red';
      break;
    case 'approved':
      icon = Check;
      colorClass = 'text-green';
      break;
    case 'suggestedChanges':
      icon = RequestChanges;
      colorClass = 'text-red';
      break;
    default:
      icon = PrimitiveDot;
      colorClass = 'color-yellow-7';
      break;
  }

  return (
    <span
      className={colorClass}
      style={{
        display: 'inline-block',
        textAlign: 'center',
        width: '20px',
        height: '20px',
      }}
    >
      <Octicon icon={icon} verticalAlign="middle" />
    </span>
  );
};
