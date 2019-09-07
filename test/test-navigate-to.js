import { navigateTo } from '../haunted-router.js';
import { waitPopState } from './helpers.js';

describe('navigateTo', () => {
  it('Navigates to the url', () => {
    const url = '/url-navigation-test';

    navigateTo(url);

    assert.strictEqual(location.pathname, url, 'Navigated');
  });

  it('Modifies the state of the history', () => {
    const url = '/url-state-test';
    const state = 'My test state for the navigateTo function';

    navigateTo(url, state);

    assert.strictEqual(history.state, state, 'Was modified')
  });

  it('Creates an entry in the history', async () => {
    const firstUrl = '/url-original';
    const secondUrl = '/url-entry-test';

    navigateTo(firstUrl);
    navigateTo(secondUrl);

    const promise = waitPopState();
    history.back();

    await promise;

    assert.strictEqual(location.pathname, firstUrl, 'Came back to the first history entry');
  });
});
