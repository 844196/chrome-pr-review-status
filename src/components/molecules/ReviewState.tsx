import React from 'react';
import styled from 'styled-components';
import { Reviewer, ReviewState as State } from '../../domain/review';
import { ReviewerIcon } from '../atoms/ReviewerIcon';
import { ReviewStateIndicator } from '../atoms/ReviewStateIndicator';

export interface ReviewStateProps {
  state: State;
  reviewers: Reviewer[];
}

export const ReviewState: React.FC<ReviewStateProps> = ({ state, reviewers }) => (
  <Wrapper>
    <ReviewStateIndicator state={state} />
    <ReviewerIcons>
      {reviewers.map(({ name, iconUrl }) => (<ReviewerIcon key={name} src={iconUrl} />))}
    </ReviewerIcons>
  </Wrapper>
);

const Wrapper = styled.div`
  box-sizing: border-box;
`;

const ReviewerIcons = styled.span`
  padding-left: 8px;
  & > * {
    margin: 0 2px;
  }
`;
