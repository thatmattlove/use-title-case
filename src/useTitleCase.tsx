import * as React from 'react';
import { useCallback, useMemo, createContext, useContext } from 'react';
import { merge } from 'merge-anything';
import vercelTitle from 'title';
import { builtInOverrides } from './builtInOverrides';

export type UseTitleCaseReturn = (title: string) => string;

export type UseTitleCaseOptions = {
  overrides?: string[];
  useBuiltIns?: boolean;
};

type UseTitleCaseOptionsKeys = keyof UseTitleCaseOptions;

type MergedUseTitleCaseOptions = {
  [K in UseTitleCaseOptionsKeys]: NonNullable<UseTitleCaseOptions[K]>;
};

const JSON_PATTERNS = [new RegExp(/(?:\[)(.*)(?:"\])/), new RegExp(/(?:\[)(.*)(?:\])/)];
const CS_PATTERN = new RegExp(/(.+,)+/);
const SINGLE_PATTERN = new RegExp(/^[^,]+$/);

const USE_BUILT_IN_OVERRIDES = process.env.REACT_TITLE_CASE_USE_OVERRIDES;
const USER_OVERRIDES = process.env.REACT_TITLE_CASE_OVERRIDES;

function getEnvOverrides(): string[] {
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

function getEnvOptions(): MergedUseTitleCaseOptions {
  let useBuiltIns = true;
  if (typeof USE_BUILT_IN_OVERRIDES === 'string' && USE_BUILT_IN_OVERRIDES === 'false') {
    useBuiltIns = false;
  }
  const overrides = getEnvOverrides();
  return { useBuiltIns, overrides };
}

const OVERRIDES = getEnvOverrides();

const DEFAULT_OPTIONS = {
  overrides: [],
  useBuiltIns: true,
} as UseTitleCaseOptions;

const TitleCaseCtx = createContext<UseTitleCaseOptions>(DEFAULT_OPTIONS);

function mergeOptions(
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

export const TitleCaseProvider: React.FC<UseTitleCaseOptions> = (
  props: React.PropsWithChildren<UseTitleCaseOptions>,
) => {
  const { children, ...rest } = props;

  const value = useMemo(() => rest, [rest]);

  return <TitleCaseCtx.Provider value={value}>{children}</TitleCaseCtx.Provider>;
};

export function useTitleCase(options: UseTitleCaseOptions = DEFAULT_OPTIONS): UseTitleCaseReturn {
  const ctx = useContext(TitleCaseCtx);

  const { overrides } = mergeOptions(options, ctx);

  function titleCase(title: string): string {
    if (typeof title !== 'string') {
      return '';
    }
    return vercelTitle(title, { special: overrides });
  }

  return useCallback(titleCase, OVERRIDES);
}

export { builtInOverrides as titleCaseOverrides } from './builtInOverrides';
