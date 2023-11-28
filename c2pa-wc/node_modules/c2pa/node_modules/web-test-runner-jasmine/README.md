# web-test-runner-jasmine

[![npm version](https://badge.fury.io/js/web-test-runner-jasmine.svg)](https://badge.fury.io/js/web-test-runner-jasmine) ![CI Build](https://github.com/coryrylan/web-test-runner-jasmine/actions/workflows/build.yml/badge.svg)

A [Web Test Runner](https://modern-web.dev/docs/test-runner/overview/) plugin for running Jasmine.

## Setup

Import `jasmineTestRunnerConfig` and add too your `web-test-runner.config.mjs`.
If using TypeScript you can add `esbuildPlugin`.

```javascript
import { playwrightLauncher } from '@web/test-runner-playwright';
import { esbuildPlugin } from '@web/dev-server-esbuild';
import { jasmineTestRunnerConfig } from 'web-test-runner-jasmine';

export default /** @type {import("@web/test-runner").TestRunnerConfig} */ ({
  ...jasmineTestRunnerConfig(),
  testFramework: {
    config: {
      timeout: 10000
    },
  },
  nodeResolve: true,
  files: ['./src/*.spec.ts'],
  browsers: [playwrightLauncher({ product: 'chromium' })],
  plugins: [esbuildPlugin({ ts: true, json: true, target: 'auto', sourceMap: true })]
});
```

Once added you can use Jasmine within your tests.

```javascript
describe('a test suite', () => {
  let element: HTMLElement;

  beforeEach(() => {
    element = document.createElement('p');
    element.innerHTML = 'hello there';
  });

  afterEach(() => {
    element.remove();
  });

  it('should create element', () => {
    expect(element.innerHTML).toBe('hello there');
  });
});
```

To run your tests run `web-test-runner` in the terminal.

```bash
web-test-runner
```

Learn more about [Web Test Runner](https://modern-web.dev/docs/test-runner/overview/).