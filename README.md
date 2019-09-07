# Haunted Router for Haunted 🦇 🎃

A client-side router for [**Haunted**](https://github.com/matthewp/haunted).

## Getting started

### Installing

Using npm:
```bash
npm install --save haunted-router
```

### Importing

If using a bundler, **Haunted Router** can be imported like any other library:
```javascript
import { useRoutes, useTitle, navigateTo, replaceTo } from 'haunted-router';
```

**Haunted Router** can also work directly in the browser without using any build tools. Simply import the `haunted-router.js` bundle. Here's an example with unpkg:
```javascript
import { useRoutes, useTitle, navigateTo, replaceTo } from 'https://unpkg.com/haunted-router@^0.0.1/haunted-router.js';
```

If you install **Haunted Router** locally, this build is located at `node_modules/haunted-router/haunted-router.js`.

## Usage

### Define the routes

Routes are defined using the `useRoutes` hook.
It takes an object as a parameter, along with a fallback value.

The keys of the object are the paths to be matched, while the values are functions to be executed when the paths are matched.
The value returned by the hook is the same as the one returned by the function.

Example:
```javascript
import { useRoutes } from 'haunted-router';
// Where using lit-html as an example, but any rendering library compatible with haunted will do
import { html, nothing } from 'lit-html';

function App() {
  const routeResult = useRoutes({
    '/': () => html`<x-page-index></x-page-index>`,
    '/about': () => html`<x-page-about></x-page-about>`,
  }, nothing);

  return html`
    <main>
      ${routeResult}
    </main>
  `;
}
```

### Define the title

The title of the document can be modified using the `useTitle` hook.
It's only parameter is a string, and it doesn't return anything.
The title is brought back to the original when the component is disconnected from the DOM.

Example:
```javascript
function App() {
  useTitle('My awesome app !');

  return html`
    <header>
      <h1>My awesome app !</h1>
    </header>
  `;
}
```

### Navigate

There are two ways to navigate using **haunted-router**:
- Programatically, using `navigateTo(url, state, stateTitle)` or `replaceTo(url, state, stateTitle)`. `navigateTo` creates an entry in the history, whilst `replaceTo` doesn't.
- With anchors, using the `router-link` custom element. Add the `replace` attribute to prevent creating an history entry.

Example:
```javascript
import { html } from 'lit-html';

return html`
  <a is="router-link" href="/url/to/destination" .state=${{ foo: 'bar' }} stateTitle="Destination page"></a>
  <a is="router-link" href="/url/to/second-tab" replace></a>
`;

// Or
import { navigateTo, replaceTo } from 'haunted-router';

navigateTo('/url/to/destination', { foo: 'bar' }, 'Destination page');
replaceTo('/url/to/second-tab');

```
`state` can be of any type, and it is optional, along with `stateTitle`.

`stateTitle` is used in `history.pushState` and `history.replaceState`, but is ignored by most browsers at the time of writing. More informations [here](https://developer.mozilla.org/en-US/docs/Web/API/History/pushState#Parameters).

> ⚠️ If you want to use the `router-link` component, you will likely want to be using a polyfill for custom built-in elements, like the lightweight [@ungap/custom-elements-builtin](https://github.com/ungap/custom-elements-builtin). Custom built-in elements are currently unavailable on Edge and Safari.

## Complete example

_main.js_
```javascript
import { component } from 'haunted';
import { useRoutes, useTitle } from 'haunted-router';

// A reminder that all libraries supported by haunted can be used
import { html, nothing } from 'lit-html';

import { mainRoutes } from './router.js';

const MyApp = () => {
  const routeResult = useRoutes(mainRoutes, nothing);

  return html`
    <header>My Awesome App</header>
    <main>${routeResult}</main>
    <footer>&copy; Haunted Router</footer>
  `;
};
```

_router.js_
```javascript
const mainRoutes = {
  // A plain url
  // Every top level URL begins with a slash
  '/': () => html`<x-page-home></x-page-home>`,

  // An URL with parameters
  '/product/:id': ({ id }) => html`<x-page-product .id=${id}></x-page-product>`,

  // Dynamically import the component
  '/about': () => {
    // No need to wait for the result, the component will appear once loaded
    import('./about.js');
    return html`<x-page-about></x-page-about>`;
  },

  // Putting a star at the end will match all the URLs that starts with the string
  // It can be used to match subroutes
  '/account*': () => html`<x-page-account></x-page-account>`,
};

const accountRoutes = {
  '/detail': () => html`<x-tab-detail></x-tab-detail>`,
  '/password': () => html`<x-tab-password></x-tab-password>`,
};

export { mainRoutes, accountRoutes };
```

_account.js_
```javascript
import { component } from 'haunted';
import { useRoutes } from 'haunted-router';
import { html, nothing } from 'lit-html';

import { accountRoutes } from './router.js';

const PageAccount = () => {
  useTitle('My Account');

  const tabResult = useRoutes(accountRoutes, nothing);

  return html`
    <h1>Account</h1>
    ${tabResult}
  `;
};

customElements.define('x-page-account', component(PageAccount));
```

## Insight
The router merely executes the function that corresponds to the current route, and returns the result.
It can be used to execute anything you want when the user navigates.
