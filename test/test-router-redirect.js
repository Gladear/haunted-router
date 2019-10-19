import { component, html } from 'haunted';
import { navigateTo } from '../lib/navigation.js';
import { attach, cycle, waitPopState } from './helpers.js';
import '../lib/router-redirect.js';

describe('router-redirect', () => {
  it('Redirects to the url', async () => {
    const tag = 'redirect-url-test';
    const url = '/redirect-url-test';

    function App() {
      return html`<router-redirect .url=${url} />`;
    }
    customElements.define(tag, component(App));

    const teardown = attach(tag);
    await cycle();

    assert.equal(location.pathname, url, 'The location is incorrect');

    teardown();
  });

  it('Creates an entry in the history', async () => {
    const tag = 'history-entry-redirect-test';
    const { pathname: original } = location;

    function App() {
      return html`<router-redirect .url=${'/redirect-entry-url-test'} />`;
    }
    customElements.define(tag, component(App));

    const teardown = attach(tag);
    await cycle();

    let popState = waitPopState();
    history.back();

    await popState;

    assert.equal(location.pathname, original, 'It did not create an history entry');

    teardown();
  });

  it('Doesn\'t create an history entry with `replace`', async () => {
    const tag = 'replace-entry-redirect-test';
    const { pathname: original } = location;

    function App() {
      return html`<router-redirect ?replace=${true} .url=${'/replace-entry-redirect-test'} />`;
    }
    customElements.define(tag, component(App));

    navigateTo('/temporary-url');

    const teardown = attach(tag);
    await cycle();

    let popState = waitPopState();

    history.back();
    await popState;

    assert.equal(location.pathname, original, 'It did create an entry in the history');

    teardown();
  });
});
