import { hook, Hook, State } from 'haunted';
import { addCurrent, removeCurrent } from './router';

interface Route<T> {
  callback: RouteCallback<T>;
  matcher: (path: string) => readonly [string | undefined, RouteParameters];
}

interface RouteParameters {
  [key: string]: string;
}

type RouteCallback<T> = (params: RouteParameters, state: any) => T;

const paramMatcher = /:[a-zA-Z0-9]+/g;

function createRouteEntry<T>([path, callback]: [string, RouteCallback<T>]): Route<T> {
  let pattern = '^',
    lastIndex = 0,
    match: RegExpExecArray | null;
  const unbound = path.slice(-1) != '*',
    names: string[] = [];

  while ((match = paramMatcher.exec(path))) {
    const [name] = match;
    names.push(name.slice(1));

    pattern += path.slice(lastIndex, match.index) + '([^/]*)';
    lastIndex = match.index + name.length;
  }

  pattern += path.slice(lastIndex, unbound ? undefined : -1);

  if (unbound) {
    pattern += '$';
  }

  const regex = new RegExp(pattern);

  const matcher = (path: string) => {
    const match = regex.exec(path);
    if (!match) return [undefined, {}] as const;

    const [string, ...values] = match;
    const params = names.reduce(
      (obj, name, i) => ({
        ...obj,
        [name]: values[i],
      }),
      {},
    );

    return [string, params] as const;
  };

  return {
    matcher,
    callback,
  };
}

interface Routes<T> {
  [path: string]: RouteCallback<T>;
}

const useRoutes = hook(
  class<T> extends Hook<[Routes<T>, T], T> {
    fallback: T;
    _routes: Route<T>[];
    _result!: T;

    constructor(id: number, state: State, routes: Routes<T>, fallback: T) {
      super(id, state);
      this.fallback = fallback;
      this._routes = Object.entries(routes).map(createRouteEntry);
    }

    update() {
      addCurrent(this);
      return this._result;
    }

    teardown() {
      removeCurrent(this);
    }

    matches(pathname: string): string | undefined {
      let match: string | undefined, params: RouteParameters;

      for (const { matcher, callback } of this._routes) {
        [match, params] = matcher(pathname);
        if (match === undefined) continue;
        this._result = callback(params, history.state);
        return match;
      }

      this._result = this.fallback;
    }
  },
);

export { useRoutes };
