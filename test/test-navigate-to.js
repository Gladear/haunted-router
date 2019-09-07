import { navigateTo } from '../haunted-router.js';
import { waitPopState } from './helpers.js';

describe('navigateTo', () => {
  it('Navigates to the url', () => {
    const url = '/url-navigation-test';

    navigateTo(url);

    assert.strictEqual(location.pathname, url, 'The current location isn\'t the one requested');
  });

  it('Modifies the state of the history', () => {
    const state = 'My test state for the navigateTo function';

    navigateTo('/temporary-url', state);

    assert.strictEqual(history.state, state, 'The state isn\'t the same as the one provided')
  });

  it('Creates an entry in the history', async () => {
    const { pathname: original } = location;

    navigateTo('/temporary-url');

    const promise = waitPopState();
    history.back();

    await promise;

    assert.strictEqual(location.pathname, original, 'The current location isn\'t the same as the original');
  });
});
