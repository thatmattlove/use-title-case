import { useCallback } from "react";
import vercelTitle from "title";
import { useTitleCaseCtx } from "./title-case.js";
import { mergeOptions, DEFAULT_OPTIONS } from "./util.js";

import type { UseTitleCaseOptions, UseTitleCaseFn } from "./types";

export function useTitleCase(options: UseTitleCaseOptions = DEFAULT_OPTIONS): UseTitleCaseFn {
  const ctx = useTitleCaseCtx();

  const { overrides } = mergeOptions(options, ctx);

  const titleFn = useCallback(
    (title: React.ReactNode): string => {
      if (typeof title !== "string") {
        return "";
      }
      return vercelTitle(title, { special: overrides });
    },
    [overrides],
  );

  return titleFn;
}
