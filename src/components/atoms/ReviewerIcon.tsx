import styled from 'styled-components';

export interface ReviewerIconProps {
  src: string;
}

export const ReviewerIcon = styled.img.attrs<ReviewerIconProps>(({ src }) => ({ src }))`
  box-sizing: border-box;
  vertical-align: text-bottom;
  width: 24px;
  border-radius: 50%;
`;

