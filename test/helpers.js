export function attach(element) {
  let el = document.createElement(element);
  host.appendChild(el);
  return () => host.removeChild(el);
}

export function cycle() {
  return new Promise(resolve => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          resolve();
        });
      });
    });
  });
}

export function waitPopState() {
  return new Promise((resolve, reject) => {
    window.addEventListener('popstate', resolve, { once: true });
    setTimeout(reject, 1000);
  });
}
