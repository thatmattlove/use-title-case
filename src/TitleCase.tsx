import * as React from 'react';
import { createContext, useContext } from 'react';
import vercelTitle from 'title';
import { mergeOptions, DEFAULT_OPTIONS } from './util';

import type { UseTitleCaseOptions } from './types';

const TitleCaseCtx = createContext<UseTitleCaseOptions>(DEFAULT_OPTIONS);

export function useTitleCaseCtx(): UseTitleCaseOptions {
  return useContext<UseTitleCaseOptions>(TitleCaseCtx);
}

export const TitleCaseProvider: React.FC<UseTitleCaseOptions> = (
  props: React.PropsWithChildren<UseTitleCaseOptions>,
) => {
  const { children, ...options } = props;

  return <TitleCaseCtx.Provider value={options}>{children}</TitleCaseCtx.Provider>;
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
