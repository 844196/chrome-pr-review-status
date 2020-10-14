import { useEffect, useState } from 'react';
import { Review, ReviewState } from '../domain/review';
import useFetch from 'use-http';

export const useFetchReviewStatus = (prUrl: string) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [error, setError] = useState<any>();
  const { loading, error: fetchError, data: body } = useFetch(prUrl, { credentials: 'include' }, [prUrl]);

  useEffect(() => {
    if (fetchError) {
      setError(fetchError);
    }
  }, [fetchError]);

  useEffect(() => {
    if (loading || error || !body) {
      return;
    }

    try {
      setReviews(() => [...parseBody(body)]);
    } catch (e) {
      setError(e);
    }
  }, [loading, error, body]);

  return [reviews, { loading, error }] as const;
};

const parseBody = (body: string): Review[] => {
  const document$ = domParser.parseFromString(body, 'text/html');

  // ドキュメント内の一番上にある .js-issue-sidebar-form (レビュワー選択フォーム) のみを取得
  // (アサインフォーム等を取得しないようにする)
  const form$ = document$.querySelector('.js-issue-sidebar-form');
  if (!form$) {
    throw new Error('レビュワー選択フォームが存在しない');
  }

  const reviews: Review[] = [];
  form$
    .querySelectorAll<HTMLSpanElement>('[data-assignee-name]')
    .forEach((span$) => {
      const name = span$.dataset.assigneeName;
      if (!name) {
        throw new Error('レビュワーユーザ名の取得に失敗');
      }

      const iconUrl = span$.querySelector('img')?.src;
      if (!iconUrl) {
        throw new Error('レビュワーアイコンURLの取得に失敗');
      }

      const svg$ = span$.nextElementSibling?.querySelector<SVGElement>('.reviewers-status-icon svg');
      const octiconClass = Array.from(svg$?.classList ?? []).find((klass) => klass.startsWith('octicon-')) ?? '';
      const state: ReviewState = OCTICON_CLASS_TO_REVIEW_STATE_MAP[octiconClass];
      if (!state) {
        throw new Error('レビュー状態の取得に失敗');
      }

      reviews.push({ state, reviewer: { name, iconUrl } });
    });

  return reviews;
};

const domParser = new DOMParser();

const OCTICON_CLASS_TO_REVIEW_STATE_MAP: { [key: string]: ReviewState } = {
  'octicon-check': 'Approved',
  'octicon-file-diff': 'RequestedChanges',
  'octicon-comment': 'LeftComments',
  'octicon-dot-fill': 'Unreviewed',
};
