import { navigateTo, replaceTo } from './navigation';

class RouterRedirect extends HTMLElement {
  connectedCallback() {
    if (this.url) {
      let fn = this.replace ? replaceTo : navigateTo;
      fn(this.url);
    }
  }

  get url() {
    return this.getAttribute('url') || '';
  }

  set url(val: string) {
    this.setAttribute('url', val);
  }

  get replace() {
    return this.hasAttribute('replace');
  }

  set replace(val: boolean) {
    if (val) {
      this.setAttribute('replace', '');
    } else {
      this.removeAttribute('replace');
    }
  }
}

customElements.define('router-redirect', RouterRedirect);
