import { navigateTo, replaceTo } from './navigation';

class RouterRedirect extends HTMLElement {
  url?: string;

  connectedCallback() {
    if (this.url) {
      let fn = this.hasAttribute('replace') ? replaceTo : navigateTo;
      fn(this.url);
    }
  }
}

customElements.define('router-redirect', RouterRedirect);
