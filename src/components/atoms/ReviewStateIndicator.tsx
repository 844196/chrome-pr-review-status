import { CheckIcon, CommentIcon, DotFillIcon, FileDiffIcon, Icon } from '@primer/octicons-react';
import React from 'react';
import styled from 'styled-components';
import { ReviewState } from '../../domain/review';

export interface ReviewStateIndicatorProps {
  state: ReviewState;
}

export const ReviewStateIndicator: React.FC<ReviewStateIndicatorProps> = ({ state }) => {
  const StateIcon = APPEARANCES[state].variant;
  return (
    <Wrapper state={state}>
      <StateIcon verticalAlign="middle" />
    </Wrapper>
  );
};

const Wrapper = styled.span<ReviewStateIndicatorProps>`
  width: 20px;
  vertical-align: text-bottom; /** Macだけ? */
  color: ${({ state }) => APPEARANCES[state].color};
  /* color: rgba(68, 77, 86, .6); */
  /* color: #586069; */
`;

const APPEARANCES: {
  [P in ReviewState]: {
    variant: Icon;
    color: string;
  };
} = {
  Unreviewed: {
    variant: DotFillIcon,
    color: '#dbab09',
  },
  LeftComments: {
    variant: CommentIcon,
    color: '#586069',
  },
  RequestedChanges: {
    variant: FileDiffIcon,
    color: '#cb2431',
  },
  Approved: {
    variant: CheckIcon,
    color: '#22863a',
  },
};
