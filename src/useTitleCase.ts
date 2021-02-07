import { useCallback } from 'react';
import vercelTitle from 'title';
import { useTitleCaseCtx } from './TitleCase';
import { mergeOptions, DEFAULT_OPTIONS } from './util';

import type { UseTitleCaseOptions, UseTitleCaseFn } from './types';

export function useTitleCase(options: UseTitleCaseOptions = DEFAULT_OPTIONS): UseTitleCaseFn {
  const ctx = useTitleCaseCtx();

  const { overrides } = mergeOptions(options, ctx);

  function titleCase(title: React.ReactNode): string {
    if (typeof title !== 'string') {
      return '';
    }
    return vercelTitle(title, { special: overrides });
  }

  return useCallback(titleCase, [overrides]);
}
