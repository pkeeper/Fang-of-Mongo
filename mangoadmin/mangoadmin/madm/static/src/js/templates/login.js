// This file was automatically generated from login.soy.
// Please don't edit this file by hand.

goog.provide('mangoadmin.templates.ui.login');

goog.require('soy');


/**
 * @param {Object.<string, *>=} opt_data
 * @return {string}
 * @notypecheck
 */
mangoadmin.templates.ui.login.dialog = function(opt_data) {
  return '<p><b>MangoAdmin</b> is a dead simple web interface to <a href="http://www.mongodb.org">mongoDB</a>written in <a href="http://www.djangoproject.com/">django</a>.</p><form id="login-form"><fieldset><label>host<input type="text" name="host" value="localhost"></label><label>port<input type="text" name="port" value="27017"></label><label>login<input type="text" name="login" value=""></label><label for="password">password<input type="password" name="password" value=""></label></fieldset></form>';
};
