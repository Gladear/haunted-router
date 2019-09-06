import { Hook } from 'haunted';

interface RouterHook extends Hook {
  matches(pathname: string): readonly [boolean, number];
}

let hookPath: RouterHook[] = [];
let farthestPath = location.pathname;

function addCurrent(hook: RouterHook) {
  if (hookPath.includes(hook)) return;
  hookPath.push(hook);
  let [matches, farthestIndex] = hook.matches(farthestPath);
  if (matches) {
    farthestPath = farthestPath.slice(farthestIndex);
  }
}

function removeCurrent(hook: RouterHook) {
  hookPath = hookPath.filter(h => h !== hook);
}

function update() {
  let matches, baseIndex = 0;
  farthestPath = location.pathname;

  for (let [index, hook] of hookPath.entries()) {
    ([matches, baseIndex] = hook.matches(farthestPath));
    hook.state.update();
    if (!matches) {
      hookPath.splice(index);
      break;
    }
    farthestPath = farthestPath.slice(baseIndex);
  }
}

export { addCurrent, removeCurrent, update };
