import { merge } from 'merge-anything';
import { builtInOverrides } from './builtInOverrides';

import type { UseTitleCaseOptions, MergedUseTitleCaseOptions } from './types';

const JSON_PATTERNS = [new RegExp(/(?:\[)(.*)(?:"\])/), new RegExp(/(?:\[)(.*)(?:\])/)];
const CS_PATTERN = new RegExp(/(.+,)+/);
const SINGLE_PATTERN = new RegExp(/^[^,]+$/);

const USE_BUILT_IN_OVERRIDES = process.env.REACT_TITLE_CASE_USE_OVERRIDES;
const USER_OVERRIDES = process.env.REACT_TITLE_CASE_OVERRIDES;

export function getEnvOverrides(): string[] {
  let overrides = [] as string[];

  if (typeof USER_OVERRIDES === 'string') {
    for (const pattern of JSON_PATTERNS) {
      if (USER_OVERRIDES.match(pattern)) {
        try {
          const envArray = JSON.parse(USER_OVERRIDES) as string[];
          overrides = [...overrides, ...envArray];
        } catch (err) {
          console.warn(
            `react-title-case tried to read overrides from environment variables, but an error occurred: ${err}`,
          );
        }
      }
    }

    if (USER_OVERRIDES.match(CS_PATTERN)) {
      overrides = [...overrides, ...USER_OVERRIDES.split(',')];
    } else if (USER_OVERRIDES.match(SINGLE_PATTERN)) {
      overrides = [...overrides, USER_OVERRIDES];
    }
  }

  return overrides;
}

export function getEnvOptions(): MergedUseTitleCaseOptions {
  let useBuiltIns = true;
  if (typeof USE_BUILT_IN_OVERRIDES === 'string' && USE_BUILT_IN_OVERRIDES === 'false') {
    useBuiltIns = false;
  }
  const overrides = getEnvOverrides();
  return { useBuiltIns, overrides };
}

export const DEFAULT_OPTIONS = {
  overrides: [],
  useBuiltIns: true,
} as UseTitleCaseOptions;

export function mergeOptions(
  hookOptions: UseTitleCaseOptions,
  ctxOptions?: UseTitleCaseOptions,
): MergedUseTitleCaseOptions {
  const { overrides: hookOverrides = [], useBuiltIns: hookUseBuiltIns = true } = hookOptions;
  const { overrides: ctxOverrides = [], useBuiltIns: ctxUseBuiltIns = true } =
    ctxOptions ?? DEFAULT_OPTIONS;
  const { useBuiltIns: envUseBuiltIns, overrides: envOverrides } = getEnvOptions();

  let options = merge<MergedUseTitleCaseOptions, MergedUseTitleCaseOptions[]>(
    { useBuiltIns: envUseBuiltIns, overrides: envOverrides },
    {
      overrides: hookOverrides,
      useBuiltIns: hookUseBuiltIns,
    },
    { overrides: ctxOverrides, useBuiltIns: ctxUseBuiltIns },
  );

  if (options.useBuiltIns) {
    options = merge<MergedUseTitleCaseOptions, MergedUseTitleCaseOptions[]>(options, {
      overrides: builtInOverrides,
      useBuiltIns: true,
    });
  }

  return options;
}
