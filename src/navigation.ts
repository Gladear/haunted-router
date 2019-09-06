import { update } from './router';

function navigateTo(url: string, state?: any, title = '') {
  history.pushState(state, title, url);
  update();
}

function replaceTo(url: string, state?: any, title = '') {
  history.replaceState(state, title, url);
  update();
}

export { navigateTo, replaceTo };
