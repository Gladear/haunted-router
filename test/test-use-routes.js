import haunted from 'https://unpkg.com/haunted@beta/core.js';
import { html, nothing, render } from 'https://unpkg.com/lit-html@^1.0.0/lit-html.js';

// import { component, html } from 'https://unpkg.com/haunted@beta/haunted.js';
import { useRoutes, navigateTo, replaceTo } from '../haunted-router.js';
import { attach, cycle } from './helpers.js';

const { component } = haunted({ render });

describe('useRoutes', () => {
  it('Executes the matching function', async () => {
    const tag = 'matching-function-routes-test';
    const expectedFoo = 0, expectedBar = 1;
    let actual;

    function App() {
      actual = useRoutes({
        '/foo': () => expectedFoo,
        '/bar': () => expectedBar,
      }, -1);

      return html`Test`;
    }
    customElements.define(tag, component(App));

    navigateTo('/foo');

    const teardown = attach(tag);
    await cycle();

    assert.strictEqual(actual, expectedFoo, 'The function matching /foo wasn\'t executed');

    replaceTo('/bar');
    await cycle();

    assert.strictEqual(actual, expectedBar, 'The function matching /bar wasn\'t executed');

    teardown();
  });

  it('Returns the fallback value if no route matches', async () => {
    const tag = 'fallback-route-test';
    const expected = 1;
    let actual;

    function App() {
      actual = useRoutes({
        '/foo': () => 2,
        '/bar': () => 3,
      }, expected);

      return html`Test`;
    }
    customElements.define(tag, component(App));

    navigateTo('/');

    const teardown = attach(tag);
    await cycle();

    assert.strictEqual(actual, expected, 'A different result was returned');

    teardown();
  });

  it('Matches beginning of path if ended by "*"', async () => {
    const tag = 'end-star-routes-test';
    const expected = 1;
    let actual;

    function App() {
      actual = useRoutes({ '/foo*': () => expected }, 2);

      return html`Test`;
    }
    customElements.define(tag, component(App));

    navigateTo('/foobar');

    const teardown = attach(tag);
    await cycle();

    assert.strictEqual(actual, expected, 'Subpath was not matched');

    teardown();
  });

  it('"*" matches everything', async () => {
    const tag = 'only-star-routes-test';
    const expected = 1;
    let actual;

    function App() {
      actual = useRoutes({ '*': () => expected }, 2);

      return html`Test`;
    }
    customElements.define(tag, component(App));

    navigateTo('/foo');

    const teardown = attach(tag);
    await cycle();

    assert.strictEqual(actual, expected, '"*" didn\'t match path /foo');

    teardown();
  });

  it('Matches routes in the definition order', async () => {
    const tag = 'match-order-routes-test';
    const expected = 1;
    let actual;

    function App() {
      useRoutes({
        '/foo': () => (actual = expected),
        '*': () => (actual = 1),
      });

      return html`Test`;
    }
    customElements.define(tag, component(App));

    navigateTo('/foo');

    const teardown = attach(tag);
    await cycle();

    assert.equal(actual, expected, 'It matched the wrong route');

    teardown();
  });

  it('Allows descendants to declare routes', async () => {
    const parentTag = 'parent-routes-test';
    const childTag = 'child-routes-test';
    const expected = 1;
    let actual;

    function Parent() {
      const route = useRoutes({
        '/foo*': () => html`<child-routes-test />`,
      }, nothing);

      return route;
    }
    customElements.define(parentTag, component(Parent));

    function Child() {
      useRoutes({
        '/bar': () => (actual = expected),
        'bar': () => (actual = 2),
      }, 10);

      return html`Test`;
    }
    customElements.define(childTag, component(Child));

    navigateTo('/foo/bar');

    const teardown = attach(parentTag);
    await cycle();

    assert.equal(actual, expected, 'Child was not rendered');

    teardown();
  });

  it('Parses url params correctly', async () => {
    const tag = 'url-params-routes-test';
    const expected = { foo: 'bar', baz: 'foobar' };
    let actual;

    function App() {
      useRoutes({
        '/foo/:foo/:baz/baz': params => (actual = params),
      });

      return html`Test`;
    }
    customElements.define(tag, component(App));

    navigateTo('/foo/bar/foobar/baz');

    const teardown = attach(tag);
    await cycle();

    assert.deepEqual(actual, expected, 'It did not parse arguments correctly');

    teardown();
  });

  it('Passes current state as the route second argument', async () => {
    const tag = 'state-arg-routes-test';
    const expected = { foo: 'bar', bar: 'foobar' };
    let actual;

    function App() {
      useRoutes({
        '*': (_, state) => (actual = state),
      });

      return html`Test`;
    }
    customElements.define(tag, component(App));

    navigateTo('/wherever', expected);

    const teardown = attach(tag);
    await cycle();

    assert.deepEqual(actual, expected, 'It didn\'t pass the new state');

    teardown();
  });
});