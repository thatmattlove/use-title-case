import { builtInOverrides } from "./built-in-overrides.js";

import type { UseTitleCaseOptions, MergedUseTitleCaseOptions } from "./types";

const JSON_PATTERNS = [new RegExp(/\[(.*)"]/), new RegExp(/\[(.*)]/)];
const CS_PATTERN = new RegExp(/(.+,)+/);
const SINGLE_PATTERN = new RegExp(/^[^,]+$/);

export const DEFAULT_OPTIONS = {
  overrides: [],
  useBuiltIns: true,
} as MergedUseTitleCaseOptions;

export function getEnvOverrides(): string[] {
  let overrides = [] as string[];

  if (typeof process === "undefined") {
    return overrides;
  }

  if (typeof process.env.REACT_TITLE_CASE_OVERRIDES === "string") {
    const overridesString = process.env.REACT_TITLE_CASE_OVERRIDES;
    for (const pattern of JSON_PATTERNS) {
      if (pattern.test(overridesString)) {
        try {
          const envArray = JSON.parse(overridesString) as string[];
          overrides = [...overrides, ...envArray];
        } catch (error) {
          console.warn(
            `react-title-case tried to read overrides from environment variables, but an error occurred: ${error}`,
          );
        }
      }
    }

    if (CS_PATTERN.test(overridesString)) {
      overrides = [...overrides, ...overridesString.split(",")];
    } else if (SINGLE_PATTERN.test(overridesString)) {
      overrides = [...overrides, overridesString];
    }
  }

  return overrides;
}

export function getEnvOptions(): MergedUseTitleCaseOptions {
  let useBuiltIns = true;
  let overrides: string[] = [];

  if (typeof process === "undefined") {
    return { overrides, useBuiltIns };
  }
  if (
    typeof process.env.REACT_TITLE_CASE_USE_OVERRIDES === "string" &&
    process.env.REACT_TITLE_CASE_USE_OVERRIDES === "false"
  ) {
    useBuiltIns = false;
  }
  overrides = getEnvOverrides();
  return { useBuiltIns, overrides };
}

function merge<T extends string = string>(...toMerge: Array<T>[]): Array<T> {
  const all = toMerge.reduce<T[]>((final, each) => {
    final = [...final, ...each];
    return final;
  }, []);
  const merged = [...new Set(all)];
  return merged;
}

export function mergeOptions(
  hookOptions: UseTitleCaseOptions,
  ctxOptions: UseTitleCaseOptions = {},
): MergedUseTitleCaseOptions {
  const { overrides: hookOverrides = [], useBuiltIns: hookUseBuiltIns = true } = hookOptions;
  const { overrides: ctxOverrides = [], useBuiltIns: ctxUseBuiltIns = true } = ctxOptions;
  const { overrides: envOverrides = [], useBuiltIns: envUseBuiltIns = true } = getEnvOptions();

  const useBuiltIns = [hookUseBuiltIns, ctxUseBuiltIns, envUseBuiltIns].includes(false);

  let overrides = merge(envOverrides, ctxOverrides, hookOverrides);

  if (useBuiltIns) {
    overrides = merge(overrides, builtInOverrides);
  }

  return { overrides, useBuiltIns };
}
