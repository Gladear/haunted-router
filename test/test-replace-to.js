import { replaceTo, navigateTo } from '../lib/navigation.js';
import { waitPopState } from './helpers.js';

describe('replaceTo', () => {
  it('Replaces the current url', () => {
    const url = '/url-navigation-test';

    replaceTo(url);

    assert.strictEqual(location.pathname, url, "The current location isn't the one requested");
  });

  it('Modifies the state of the history', () => {
    const state = 'My test state for the replaceTo function';

    replaceTo('/temporary-url', state);

    assert.strictEqual(history.state, state, "The state isn't the same as the one provided");
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

    assert.strictEqual(
      location.pathname,
      url,
      'The current location is not the same as the replaced url',
    );

    popState = waitPopState();
    history.back();

    await popState;

    assert.strictEqual(
      location.pathname,
      originalUrl,
      'The current location is not the same as the original',
    );
  });
});
