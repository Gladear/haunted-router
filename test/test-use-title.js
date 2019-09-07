import haunted from 'https://unpkg.com/haunted@beta/core.js';
import { html, render } from 'https://unpkg.com/lit-html@^1.0.0/lit-html.js';

// import { component, html } from 'https://unpkg.com/haunted@beta/haunted.js';
import { useTitle } from '../haunted-router.js';
import { attach, cycle } from './helpers.js';

const { component } = haunted({ render });

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

    assert.strictEqual(document.title, title, 'The title wasn\'t modified');

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

    assert.strictEqual(document.title, original, 'The title wasn\'t reverted to the original');
  });
});
