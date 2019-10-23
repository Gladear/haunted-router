import { Hook } from 'haunted';

interface RouterHook extends Hook {
  matches(pathname: string): string | undefined;
}

let hookPath = new Map<RouterHook, string | undefined>(),
  farthestPath = location.pathname;

function addCurrent(hook: RouterHook) {
  if (hookPath.has(hook)) return;
  let match = hook.matches(farthestPath);
  hookPath.set(hook, match);
  if (match) farthestPath = farthestPath.slice(match.length);
}

function removeCurrent(hook: RouterHook) {
  hookPath.delete(hook);
}

function update() {
  let match: string | undefined;
  farthestPath = location.pathname;

  for (let [hook, oldMatch] of hookPath.entries()) {
    match = hook.matches(farthestPath);
    if (!match) {
      hook.state.update();
      break;
    }

    if (oldMatch !== match) {
      hook.state.update();
      hookPath.set(hook, match);
    }

    farthestPath = farthestPath.slice(match.length);
  }

  // Update the last item of the hook path anyway
  const lastHook = [...hookPath.keys()].pop();
  if (lastHook) {
    lastHook.state.update();
  }
}

export { addCurrent, removeCurrent, update };
