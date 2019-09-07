import { component, html } from 'https://unpkg.com/haunted@beta/haunted.js';
import { useTitle } from '../haunted-router.js';
import { attach, cycle } from './helpers.js';

describe('useTitle', () => {
  it('Redefines the title of the document', async () => {
    const tag = 'redefine-title-test';
    const title = 'My test title for the test of the useTitle hook !';

    function App() {
      useTitle(title);

      return html`Test`;
    }
    customElements.define(tag, component(App));

    let teardown = attach(tag);
    await cycle();

    assert.strictEqual(document.title, title, 'Is redefined');

    teardown();
  });

  it('Reverts the title back to the original on teardown', async () => {
    const tag = 'revert-title-test';
    const { title: original } = document;
    const title = 'My test title for the test of the useTitle hook !';

    function App() {
      useTitle(title);

      return html`Test`;
    }
    customElements.define(tag, component(App));

    let teardown = attach(tag);
    await cycle();

    teardown();
    await cycle();

    assert.strictEqual(document.title, original, 'Is reverted back to the original title');
  });
});
