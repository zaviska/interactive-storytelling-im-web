/*
 * ESLint rule-set
 * ===============
 *
 * The following rules are intended to be the least restrictive possible. Tweak
 * them as much as you want, or simply replace this file with another one you
 * have previously edited.
 *
 * Learn more about how to configure ESLint at
 *   <http://eslint.org/docs/user-guide/configuring>.
 */

exports.env = {
  // Enable ES2015+ features
  es6: true,

  // Enable Browser global variables
  browser: true
};

exports.parserOptions = {
  // Validate ECMAScript 2015+ syntax
  ecmaVersion: 2017,

  // Allow ECMAScript modules
  sourceType: 'module'
};

exports.globals = {
  PIXI: false,
  Phaser: false
};

exports.extends = 'eslint:recommended';

exports.rules = {

};
