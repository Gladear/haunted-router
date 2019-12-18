import { component, html } from 'haunted';
import { navigateTo, useRoutes, useSearchParams } from '../haunted-router.js';
import { attach, cycle } from './helpers.js';

describe('useSearchParams', async () => {
  it('Matches the parameters in the URL', async () => {
    const tag = 'url-search-params-test';
    const expected = {
      foo: 'bar',
      baz: 'foobar'
    };
    let actual;

    function App() {
      actual = useSearchParams();

      return html`
        test
      `;
    }
    customElements.define(tag, component(App));

    navigateTo('/test-url?foo=bar&baz=foobar');

    const teardown = attach(tag);
    await cycle();

    assert.deepEqual(actual, expected, "The parameters don't match the URL");

    teardown();
  });

  it('Is updated when the user navigates', async () => {
    const tag = 'params-update-navigate-params-test';
    let expected, actual;

    function App() {
      useRoutes({
        '*': () => {}
      });
      actual = useSearchParams();

      return html`
        test
      `;
    }
    customElements.define(tag, component(App));

    navigateTo('/test-url?foo=bar&baz=foobar');

    const teardown = attach(tag);
    await cycle();

    expected = actual;

    navigateTo('/test-url?bar=foo&foobar=baz');
    await cycle();

    assert.notStrictEqual(actual, expected, "The object wasn't recomputed");

    teardown();
  });

  it('Is not updated if only the state changes', async () => {
    const tag = 'url-memo-search-params-test';
    let expected, actual;

    function App() {
      useRoutes({
        '*': () => {}
      });
      actual = useSearchParams();

      return html`
        test
      `;
    }
    customElements.define(tag, component(App));

    navigateTo('/test-url?foo=bar&baz=foobar', { someState: true });

    const teardown = attach(tag);
    await cycle();

    expected = actual;

    navigateTo('/test-url?foo=bar&baz=foobar', { someState: false });
    await cycle();

    assert.strictEqual(actual, expected, 'The object was recomputed');

    teardown();
  });

  it("Is not update if the search string doesn't change", async () => {
    const tag = 'params-memo-search-params-test';
    let expected, actual;

    function App() {
      useRoutes({
        '*': () => {}
      });
      actual = useSearchParams();

      return html`
        test
      `;
    }
    customElements.define(tag, component(App));

    navigateTo('/test-url?foo=bar&baz=foobar');

    const teardown = attach(tag);
    await cycle();

    expected = actual;

    navigateTo('/foo-test-bar?foo=bar&baz=foobar');
    await cycle();

    assert.strictEqual(actual, expected, 'The object was recomputed');

    teardown();
  });
});
