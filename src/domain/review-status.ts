import { Review, ReviewResult } from './review';

export type ReviewStatus = { [P in ReviewResult]: Review[] };
