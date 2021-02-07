import { useCallback } from 'react';
import vercelTitle from 'title';
import { useTitleCaseCtx } from './TitleCase';
import { mergeOptions, getEnvOverrides, DEFAULT_OPTIONS } from './util';

import type { UseTitleCaseOptions, UseTitleCaseFn } from './types';

const OVERRIDES = getEnvOverrides();

export function useTitleCase(options: UseTitleCaseOptions = DEFAULT_OPTIONS): UseTitleCaseFn {
  const ctx = useTitleCaseCtx();

  const { overrides } = mergeOptions(options, ctx);

  function titleCase(title: string): string {
    if (typeof title !== 'string') {
      return '';
    }
    return vercelTitle(title, { special: overrides });
  }

  return useCallback(titleCase, OVERRIDES);
}
