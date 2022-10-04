import * as React from "react";
import { createContext, useContext, useMemo } from "react";
import { useTitleCase } from "./use-title-case";
import { DEFAULT_OPTIONS } from "./util";

import type { UseTitleCaseOptions } from "./types";

export const TitleCaseCtx = createContext<UseTitleCaseOptions>(DEFAULT_OPTIONS);

export function useTitleCaseCtx(): UseTitleCaseOptions {
  return useContext<UseTitleCaseOptions>(TitleCaseCtx);
}

export const TitleCaseProvider = (
  props: React.PropsWithChildren<UseTitleCaseOptions>,
): JSX.Element => {
  const { children, ...options } = props;

  const value = useMemo(() => options, [options]);

  return <TitleCaseCtx.Provider value={value}>{children}</TitleCaseCtx.Provider>;
};

export const TitleCase = (props: React.PropsWithChildren<UseTitleCaseOptions>): JSX.Element => {
  const { children, ...options } = props;
  const titleFn = useTitleCase(options);
  if (typeof children !== "string") {
    return <>{children}</>;
  }
  return <>{titleFn(children)}</>;
};
