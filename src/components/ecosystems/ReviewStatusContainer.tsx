import React from 'react';
import { useFetchReviewStatus } from '../../hooks/useFetchReviewStatus';
import { ReviewStatus } from '../organisms/ReviewStatus';

export interface ReviewStatusContainerProps {
  prUrl: string;
  row$: HTMLElement;
}

export const ReviewStatusContainer: React.FC<ReviewStatusContainerProps> = ({ prUrl }) => {
  const [reviews, { loading, error }] = useFetchReviewStatus(prUrl);
  if (error) {
    console.error(error);
  }

  // TODO 多分ここより上層の責務
  // useEffect(() => {
  //   if (!enableBackgroundColor) {
  //     return;
  //   }
  //   const myReview = reviews.find(({ reviewer: { name } }) => name === loginUsername);
  //   if (myReview) {
  //     rowDom.style.backgroundColor = ROW_BG_COLOR_MAP[myReview.state] ?? 'inherit';
  //   }
  // }, [reviews]);

  return (<ReviewStatus loading={loading} error={error} reviews={reviews} />);
};

// const ROW_BG_COLOR_MAP: { [P in ReviewState]: string } = {
//   Unreviewed: '#f3f3b9',
//   Approved: '#b9f3d2',
//   LeftComments: '#e2e2e2',
//   RequestedChanges: '#f3b9b9',
// };
