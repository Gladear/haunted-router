import { navigateTo, replaceTo } from './navigation';

function clickHandler(this: RouterLink, ev: Event) {
  ev.preventDefault();
  let fn = this.replace ? replaceTo : navigateTo;
  fn(this.href, this.state);
}

class RouterLink extends HTMLAnchorElement {
  state?: any;

  connectedCallback() {
    this.appendChild(document.createElement('slot'));
    this.addEventListener('click', clickHandler);
  }

  disconnectedCallback() {
    this.removeEventListener('click', clickHandler);
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

customElements.define('router-link', RouterLink, { extends: 'a' });
