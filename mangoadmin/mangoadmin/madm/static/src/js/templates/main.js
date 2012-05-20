// This file was automatically generated from main.soy.
// Please don't edit this file by hand.

goog.provide('mangoadmin.templates.main');

goog.require('soy');
goog.require('mangoadmin.templates.helper');


/**
 * @param {Object.<string, *>=} opt_data
 * @return {string}
 * @notypecheck
 */
mangoadmin.templates.main.base = function(opt_data) {
  return ((! opt_data.contentOnly) ? '<!--[if lt IE 7]><p class=chromeframe>Your browser is <em>ancient!</em><a href="http://browsehappy.com/">Upgrade to a different browser</a> or<a href="http://www.google.com/chromeframe/?redirect=true">install Google Chrome Frame</a>to experience this site.</p><![endif]--><header id="header">' + mangoadmin.templates.helper.topbar(null) + '</header><div class="container-fluid" role="main" id="container">' : '') + ((opt_data.content) ? mangoadmin.templates.helper.herounit(opt_data) + opt_data.content : '') + ((! opt_data.contentOnly) ? '</div><div class="container" role="footer">' + mangoadmin.templates.helper.footer(opt_data) + '<div>' : '');
};


/**
 * @param {Object.<string, *>=} opt_data
 * @return {string}
 * @notypecheck
 */
mangoadmin.templates.main.login = function(opt_data) {
  return mangoadmin.templates.main.base(soy.$$augmentData(opt_data, {header: '<p id="start-app"><a onclick="mangoadmin.main()">Start App</a></p>', content: '<hr />'}));
};


/**
 * @param {Object.<string, *>=} opt_data
 * @return {string}
 * @notypecheck
 */
mangoadmin.templates.main.ui = function(opt_data) {
  return mangoadmin.templates.main.base(soy.$$augmentData(opt_data, {skipHeroUnit: true, contentOnly: true, content: '<div class="row-fluid"><div class="span3"><ul class="nav nav-list"><li class="nav-header">Database</li><li id="databases-list"></li><li class="nav-header">Collection</li><li id="collection-list"></li></ul></div><div class="span9"><div id="collection-content"></div></div></div></div>'}));
};
