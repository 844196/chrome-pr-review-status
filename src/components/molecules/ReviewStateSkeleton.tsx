import React from 'react';
import ContentLoader from 'react-content-loader';

export interface ReviewStateSkeletonProps {}

export const ReviewStateSkeleton: React.FC<ReviewStateSkeletonProps> = () => (
  <ContentLoader
    speed={2}
    height={24}
    width={100}
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
  >
    <circle cx="8" cy="12" r="8" />
    <rect x="26" y="7" rx="5" ry="5" width="72" height="10" />
  </ContentLoader>
);
