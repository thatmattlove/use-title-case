import { useCallback } from 'react';
import vercelTitle from 'title';
import { builtInOverrides } from './builtInOverrides';

export type UseTitleCaseReturn = (title: string) => string;

export interface UseTitleCaseOptions {
  overrides?: string[];
}

const JSON_PATTERNS = [new RegExp(/(?:\[)(.*)(?:"\])/), new RegExp(/(?:\[)(.*)(?:\])/)];
const CS_PATTERN = new RegExp(/(.+,)+/);
const SINGLE_PATTERN = new RegExp(/^[^,]+$/);

const USE_BUILT_IN_OVERRIDES = process.env.REACT_TITLE_CASE_USE_OVERRIDES;
const USER_OVERRIDES = process.env.REACT_TITLE_CASE_OVERRIDES;

function getOverrides(): string[] {
  let overrides = [] as string[];
  let useBuiltIns = true;

  if (typeof USE_BUILT_IN_OVERRIDES === 'string') {
    if (USE_BUILT_IN_OVERRIDES.toLowerCase() === 'false') {
      useBuiltIns = false;
    }
  }

  if (useBuiltIns) {
    overrides = [...overrides, ...builtInOverrides];
  }

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

const OVERRIDES = getOverrides();

const DEFAULT_OPTIONS = {
  overrides: [],
} as UseTitleCaseOptions;

export function useTitleCase(options: UseTitleCaseOptions = DEFAULT_OPTIONS): UseTitleCaseReturn {
  const { overrides = [] } = options;
  const special = [...overrides, ...OVERRIDES];

  function titleCase(title: string): string {
    if (typeof title !== 'string') {
      return '';
    }
    return vercelTitle(title, { special });
  }

  return useCallback(titleCase, OVERRIDES);
}

export { builtInOverrides as titleCaseOverrides } from './builtInOverrides';
