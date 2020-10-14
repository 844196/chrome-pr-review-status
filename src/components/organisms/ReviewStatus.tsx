import { Icon, NorthStarIcon, XCircleIcon } from '@primer/octicons-react';
import React from 'react';
import styled from 'styled-components';
import { Review, Reviewer, ReviewState as State } from '../../domain/review';
import { ReviewState } from '../molecules/ReviewState';
import { ReviewStateSkeleton } from '../molecules/ReviewStateSkeleton';

export interface ReviewStatusProps {
  loading: boolean;
  error?: any;
  reviews: Review[];
}

export const ReviewStatus: React.FC<ReviewStatusProps> = ({ loading, error, reviews }) => {
  if (loading) {
    return (<ReviewStatesWrapper>{SORT_ORDER.map((state) => <ReviewStateSkeleton key={state} />)}</ReviewStatesWrapper>);
  }

  if (error) {
    return (<Message icon={XCircleIcon}>Occurred error</Message>)
  }

  if (reviews.length === 0) {
    return (<Message icon={NorthStarIcon}>No reviews</Message>)
  }

  const groupedReviewers = reviews.reduce<{ [P in State]?: Reviewer[] }>((acc, { state, reviewer }) => {
    (acc[state] ?? (acc[state] = [])).push(reviewer);
    return acc;
  }, {});
  const states = SORT_ORDER.map((state) => {
    const reviewers = groupedReviewers[state] ?? [];
    return reviewers.length > 0 ? <ReviewState key={state} state={state} reviewers={reviewers} /> : null;
  });

  return (<ReviewStatesWrapper>{states}</ReviewStatesWrapper>);
};

const ReviewStatesWrapper = styled.div`
  display: grid;
  gap: .4em;
`;

const Message = ({ icon: Icon, children }: React.PropsWithChildren<{ icon: Icon }>) => (
  <MessageWrapper>
    <Icon size={24} />
    <div>{children}</div>
  </MessageWrapper>
);
const MessageWrapper = styled.div`
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
  color: #586069;
  flex-direction: column;
  & > :nth-child(n+2) {
    margin-top: .5em;
    font-size: 12px;
  }
`;

const SORT_ORDER: State[] = [
  'Approved',
  'RequestedChanges',
  'LeftComments',
  'Unreviewed',
];
