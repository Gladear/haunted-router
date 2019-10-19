function attach(element) {
  let el = document.createElement(element);
  host.appendChild(el);
  return () => host.removeChild(el);
}

async function cycle() {
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

async function waitPopState() {
  return new Promise((resolve, reject) => {
    window.addEventListener('popstate', resolve, { once: true });
    setTimeout(reject, 1000);
  });
}

export { attach, cycle, waitPopState };
