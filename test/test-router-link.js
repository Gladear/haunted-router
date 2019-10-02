import { navigateTo } from '../src/navigation.ts';
import { cycle, waitPopState } from './helpers.js';
import '../src/router-link.ts';

function attachLink() {
  const el = document.createElement('a', { is: 'router-link' });
  host.appendChild(el);
  return [el, () => host.removeChild(el)];
}

describe('router-link', () => {
  it('Mounts', async () => {
    try {
      const [, teardown] = attachLink();
      await cycle();

      teardown();
    } catch {
      assert.fail('Link failed to mount');
    }
  });

  it('Navigates to the url', () => {
    const url = '/link-navigation-test';
    const [el, teardown] = attachLink();
    el.href = url;

    el.click();

    assert.strictEqual(location.pathname, url, 'Current location is incorrect');

    teardown();
  });

  it('Defines the state', () => {
    const url = '/link-state-test';
    const state = 'link-state-test';
    const [el, teardown] = attachLink();
    Object.assign(el, { href: url, state });

    el.click();

    assert.strictEqual(history.state, state, 'State is not defined');

    teardown();
  });

  it('Creates an entry in the history', async () => {
    const { pathname: original } = location;
    const url = '/link-history-entry-test';
    const [el, teardown] = attachLink();
    el.href = url;

    el.click();

    const popState = waitPopState();
    history.back();

    await popState;

    assert.strictEqual(location.pathname, original, 'No entry were created in the history');

    teardown();
  });

  it('Doesn\'t create an history entry with `replace`', async () => {
    const { pathname: original } = location;
    const secondUrl = '/url-entry-test';

    const [el, teardown] = attachLink();
    el.href = secondUrl;
    el.setAttribute('replace', '');

    navigateTo('/temporary-url');

    el.click();

    const popState = waitPopState();
    history.back();

    await popState;

    assert.strictEqual(location.pathname, original, 'An entry was created in the history');

    teardown();
  });
});
