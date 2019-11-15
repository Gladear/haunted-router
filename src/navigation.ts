import { update } from './router';

function navigateTo(url: string, state?: any) {
  history.pushState(state, '', url);
  update();
}

function replaceTo(url: string, state?: any) {
  history.replaceState(state, '', url);
  update();
}

window.addEventListener('popstate', update);

export { navigateTo, replaceTo };
