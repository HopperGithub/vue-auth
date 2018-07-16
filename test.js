/*!
 * vue-auth <https://github.com/HopperGithub/vue-auth>
 *
 * Copyright (c) 2018-present, Hopper Sun.
 * Released under the MIT License.
 */

'use strict';

require('mocha');
var assert = require('assert');
var hasEmptyProperty = require('./');

var unfixtures = [
  '',
  null,
  undefined,
];

var fixtures = [
  '   ',
  '\r\n\t',
  '3a',
  'false',
  'null',
  'true',
  'undefined',
  +'abc',
  +/foo/,
  +[1, 2, 4],
  +Infinity,
  +Math.sin,
  +NaN,
  +undefined,
  +{ a: 1 },
  +{},
  /foo/,
  [1, 2, 3],
  [1],
  [],
  true,
  false,
  +function () { },
  function () { },
  Infinity,
  -Infinity,
  Math.sin,
  NaN,
  true,
  false,
  0,
  new Date(),
  {}
];

function emptyProperty (obj, num) {
  var title, msg;
  if (num === 0) {
    title = ' should not have a property';
    msg = 'do not have a property';
  } else if (num) {
    title = ' should not have a empty property';
    msg = 'not has a empty property';
  } else {
    title = ' should has a empty property at least';
    msg = 'has a empty property at least';
  }
  for (var property in obj) {
    it(property + JSON.stringify(obj[property]) + title, function () {
      var has = hasEmptyProperty(obj[property]);
      assert(num ? !has : has, `expected ${String(obj[property])} ${msg}`);
    });
  }
}

function getArr (item, index) {
  return [
    {'object: ': { [index]: item, b: 'true' }},
    {'array: ': new Array(item, 1)}
  ];
}

describe('empty object, array', function () {
  var emptyFixtures = [
    {},
    [],
    undefined,
    null
  ];
  emptyFixtures.forEach(function (obj) {
    emptyProperty(obj, 0);
  });
});

describe('has a empty property', function () {
  unfixtures.forEach(function (item, index) {
    var arr = getArr(item, index);
    arr.forEach(function (obj) {
      emptyProperty(obj);
    });
  });
});

describe('not have a empty property', function () {
  fixtures.forEach(function (item, index) {
    var arr = getArr(item, index);
    arr.forEach(function (obj) {
      emptyProperty(obj, true);
    });
  });
});
