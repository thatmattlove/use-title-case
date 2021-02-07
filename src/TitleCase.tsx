import * as React from 'react';
import { createContext, useContext, useMemo } from 'react';
import vercelTitle from 'title';
import { mergeOptions, DEFAULT_OPTIONS } from './util';

import type { UseTitleCaseOptions } from './types';

export const TitleCaseCtx = createContext<UseTitleCaseOptions>(DEFAULT_OPTIONS);

export function useTitleCaseCtx(): UseTitleCaseOptions {
  return useContext<UseTitleCaseOptions>(TitleCaseCtx);
}

export const TitleCaseProvider: React.FC<UseTitleCaseOptions> = (
  props: React.PropsWithChildren<UseTitleCaseOptions>,
) => {
  const { children, ...options } = props;

  const value = useMemo(() => options, [options]);

  return <TitleCaseCtx.Provider value={value}>{children}</TitleCaseCtx.Provider>;
};

export const TitleCase: React.FC<UseTitleCaseOptions> = (
  props: React.PropsWithChildren<UseTitleCaseOptions>,
) => {
  const { children, ...options } = props;
  if (typeof children !== 'string') {
    return <>{children}</>;
  }
  return (
    <TitleCaseCtx.Consumer>
      {function render(value) {
        const { overrides } = mergeOptions(options, value);

        function titleCase(title: string): string {
          if (typeof title !== 'string') {
            return '';
          }
          return vercelTitle(title, { special: overrides });
        }
        return titleCase(children);
      }}
    </TitleCaseCtx.Consumer>
  );
};
