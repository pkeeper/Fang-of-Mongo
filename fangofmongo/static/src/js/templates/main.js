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
  return ((! opt_data.contentOnly) ? '<!--[if lt IE 7]><p class=chromeframe>Your browser is <em>ancient!</em><a href="http://browsehappy.com/">Upgrade to a different browser</a> or<a href="http://www.google.com/chromeframe/?redirect=true">install Google Chrome Frame</a>to experience this site.</p><![endif]--><header id="header"></header><div class="container" role="main"><div id="container">' : '') + ((opt_data.content) ? mangoadmin.templates.helper.herounit(opt_data) + opt_data.content : '') + ((! opt_data.contentOnly) ? '</div>' + mangoadmin.templates.helper.footer(opt_data) + '</div>' : '');
};


/**
 * @param {Object.<string, *>=} opt_data
 * @return {string}
 * @notypecheck
 */
mangoadmin.templates.main.login = function(opt_data) {
  return mangoadmin.templates.main.base(soy.$$augmentData(opt_data, {header: '<p id="start-app"><a onclick="mangoadmin.main()">Start App</a></p>', content: ''}));
};


/**
 * @param {Object.<string, *>=} opt_data
 * @return {string}
 * @notypecheck
 */
mangoadmin.templates.main.ui = function(opt_data) {
  return mangoadmin.templates.main.base(soy.$$augmentData(opt_data, {skipHeroUnit: true, content: '<div><span id="brand">MangoAdmin</span><span>Server info: </span><span class="mongodb-info">[version: ' + soy.$$escapeHtml(opt_data.version) + ', bits: ' + soy.$$escapeHtml(opt_data.bits) + ']</span><a href="#" id="about">About MA</a></div><div><span id="mongo_ui_header_tools"><span id="mongo_ui_header_tools_bus"></span><span id="fom_utils"></span></span><div id="mongo_ui_menu"></div><div id="errors"></div></div><div id="mongo_ui_container"><div id=\'mongo_ui_lists\'><h2>Database</h2><div id=\'mongo_ui_database_list\'></div><h2>Collection</h2><div id=\'mongo_ui_collection_list\'></div></div></div>'}));
};
