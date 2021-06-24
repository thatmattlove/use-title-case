<div align="center">
    <br/>
    <h3><code>useTitleCase()</code></h3>
    <br/>

[![Tests](https://img.shields.io/github/workflow/status/thatmattlove/use-title-case/Tests?label=Tests&style=for-the-badge)](https://github.com/thatmattlove/use-title-case/actions?query=workflow%3A%Tests%22)

[![npm](https://img.shields.io/npm/v/use-title-case?style=for-the-badge)](https://npmjs.com/package/use-title-case)

</div>

React Title Case is a simple React Hook that provides a callback for [Vercel's title library](https://github.com/vercel/title), which correctly capitalizes strings as per [The Chicago Manual of Style](http://www.chicagomanualofstyle.org/home.html).

## Installation

```bash
# Using yarn
yarn add use-title-case

# Using npm
npm install use-title-case
```

## Usage

### Hook

```js
import { useTitleCase } from 'use-title-case';

export const YourSnazzyComponent = () => {
  const title = useTitleCase();

  return (
    <div>
      <h1>{title('i Am An INCorrectly capitAlized TITLE')}</h1>
    </div>
  );
};
// The <h1/ > element's text will be rendered as "I am an Incorrectly Capitalized Title"
```

### Component

```js
import { TitleCase } from 'use-title-case';

export const YourSnazzyComponent = () => {
  return (
    <div>
      <h1>
        <TitleCase>i Am An INCorrectly capitAlized TITLE</TitleCase>
      </h1>
    </div>
  );
};
// The <h1/ > element's text will be rendered as "I am an Incorrectly Capitalized Title"
```

### Overrides

React Title Case comes with some (primarily networking/infrastructure-focused) built-in overrides. However, you can add override strings in multiple ways, as needed:

#### Per-Hook

```js
import { useTitleCase } from 'use-title-case';

export const YourSnazzyComponent = () => {
  const title = useTitleCase({ overrides: ['TITLE'] });

  return (
    <div>
      <h1>{title('i Am An INCorrectly capitAlized TITLE')}</h1>
    </div>
  );
};
// The <h1/ > element's text will be rendered as "I am an Incorrectly Capitalized TITLE"
```

#### Environment Variables

```bash
# As a comma-separated list:
export USER_OVERRIDES="INCorrectly,TITLE"

# As a JSON array:
export USER_OVERRIDES="[INCorrectly,TITLE]"

# This will also work:
export USER_OVERRIDES='["INCorrectly","TITLE"]'
```

#### Context Provider

```js
import { TitleCaseProvider, useTitleCase } from 'use-title-case';

export const YourSnazzyComponent = () => {
  const title = useTitleCase();

  return (
    <div>
      <h1>{title('i Am An INCorrectly capitAlized TITLE')}</h1>
    </div>
  );
};

export const App = () => {
  return (
    <TitleCaseProvider overrides={['INCorrectly', 'TITLE']}>
      <YourSnazzyComponent />
    </TitleCaseProvider>
  );
};
// The <h1/ > element's text will be rendered as "I am an INCorrectly Capitalized TITLE"
```

### Options

| Property      | Type       | Default                                                                                      | Description                                                    |
| :------------ | :--------- | :------------------------------------------------------------------------------------------- | :------------------------------------------------------------- |
| `overrides`   | `string[]` | [See here](https://github.com/thatmattlove/use-title-case/blob/main/src/builtInOverrides.ts) | Provide an array of strings that should not be capitalized     |
| `useBuiltIns` | `boolean`  | `true`                                                                                       | Set to `false` if you don't want to use the default overrides. |

![License](https://img.shields.io/github/license/thatmattlove/use-title-case?color=%23000&style=for-the-badge)
