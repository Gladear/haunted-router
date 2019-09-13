/*
 * This file is meant to test the typings of the library.
 * These are not actually run, but if you open the file in an
 * IDE that supports TypeScript, then you can quickly make sure that the
 * postive tests have no errors and the negative tests have errors.
 */

import {
  useRoutes,
  useTitle,
  navigateTo,
  replaceTo,
} from '../';

// useRoutes
// positive tests, should pass
useRoutes({
  '/': () => 0,
  '/page': () => 1,
}, 2);
useRoutes({}, undefined);
// negative tests, shouldn't pass
useRoutes();
useRoutes({});
useRoutes(/path/, 3);
useRoutes({}, undefined, 'unused parameter');

// useTitle
// positive tests, should pass
useTitle('My title');
// negative tests, shouldn't pass
useTitle();
useTitle(4);
useTitle('My title', 5);

// navigateTo
// positive tests, should pass
navigateTo('/');
navigateTo('/home', 'newState');
navigateTo('/about', { my: 'state' }, 'About page');
// negative tests, shouldn't pass
navigateTo();
navigateTo(6);
navigateTo('/', {}, 7);

// replaceTo
// positive tests, should pass
replaceTo('/');
replaceTo('/home', 'newState');
replaceTo('/about', { my: 'state' }, 'About page');
// negative tests, shouldn't pass
replaceTo();
replaceTo(8);
replaceTo('/', {}, 9);
