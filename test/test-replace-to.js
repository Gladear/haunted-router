import { replaceTo, navigateTo } from '../haunted-router.js';
import { waitPopState } from './helpers.js';

describe('replaceTo', () => {
  it('Replaces the current url', () => {
    const url = '/url-navigation-test';

    replaceTo(url);

    assert.strictEqual(location.pathname, url, 'Navigated');
  });

  it('Modifies the state of the history', () => {
    const url = '/url-state-test';
    const state = 'My test state for the navigateTo function';

    replaceTo(url, state);

    assert.strictEqual(history.state, state, 'Was modified')
  });

  it('Does not create an entry in the history', async () => {
    const { pathname: originalUrl } = location;
    const url = '/url-entry-test';
    let popState;

    navigateTo('/temporary-url');
    replaceTo(url);
    navigateTo('/temporary-url');
    replaceTo(url);

    popState = waitPopState();
    history.back();

    await popState;

    assert.strictEqual(location.pathname, url, 'Came back to the replaced url');

    popState = waitPopState();
    history.back();

    await popState;

    assert.strictEqual(location.pathname, originalUrl, 'Came back to the original url');
  });
});
