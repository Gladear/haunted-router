/*
 * This file is meant to test the typings of the library.
 * These are not actually run, but if you open the file in an
 * IDE that supports TypeScript, then you can quickly make sure that the
 * postive tests have no errors and the negative tests have errors.
 */

import { navigateTo, replaceTo, useRoutes, useSearchParams, useTitle } from '../';

// # navigateTo
// positive tests, should pass
navigateTo('/');
navigateTo('/home', 'newState');
navigateTo('/about', { my: 'state' });
// negative tests, shouldn't pass
navigateTo();
navigateTo(6);
navigateTo('/', {}, 7);

// # replaceTo
// positive tests, should pass
replaceTo('/');
replaceTo('/home', 'newState');
replaceTo('/about', { my: 'state' });
// negative tests, shouldn't pass
replaceTo();
replaceTo(8);
replaceTo('/', {}, 9);

// # useRoutes
// positive tests, should pass
useRoutes(
  {
    '/': () => 0,
    '/page': () => 1,
  },
  2
);
// negative tests, shouldn't pass
useRoutes();
useRoutes(
  {
    '/': () => 'a string',
  },
  0
);
useRoutes(/path/, 3);
useRoutes({}, undefined, 'unused parameter');

// # useSearchParams
// positive tests, should pass
useSearchParams();
useSearchParams() as object;
useSearchParams() as { [key: string]: string };
// negative tests, shouldn't pass
useSearchParams() as { [key: string]: int };

// # useTitle
// positive tests, should pass
useTitle('My title');
// negative tests, shouldn't pass
useTitle();
useTitle(4);
useTitle('My title', 5);
