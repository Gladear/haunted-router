import { navigateTo, replaceTo } from './navigation';

function clickHandler(this: RouterLink, ev: Event) {
  ev.preventDefault();
  let fn = this.replace ? replaceTo : navigateTo;
  fn(this.href, this.state);
}

class RouterLink extends HTMLAnchorElement {
  state?: any;
  replace?: boolean;

  connectedCallback() {
    this.appendChild(document.createElement('slot'));
    this.addEventListener('click', clickHandler);
  }

  disconnectedCallback() {
    this.removeEventListener('click', clickHandler);
  }
}

customElements.define('router-link', RouterLink, { extends: 'a' });
