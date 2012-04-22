// This file was automatically generated from helper.soy.
// Please don't edit this file by hand.

goog.provide('mangoadmin.templates.helper');

goog.require('soy');


/**
 * @param {Object.<string, *>=} opt_data
 * @return {string}
 * @notypecheck
 */
mangoadmin.templates.helper.herounit = function(opt_data) {
  return (! opt_data.skipHeroUnit) ? '<div class="hero-unit">' + ((opt_data.header) ? '<h1>' + soy.$$escapeHtml(opt_data.header) + '</h1>' : '<h1>Language Trainer</h1>') + ((opt_data.description) ? '<p>' + soy.$$escapeHtml(opt_data.description) + '</p>' : '<p>This is the main input interface...</p>') + '</div>' : '';
};


/**
 * @param {Object.<string, *>=} opt_data
 * @return {string}
 * @notypecheck
 */
mangoadmin.templates.helper.chromeframe = function(opt_data) {
  return '<!--[if lt IE 7]><p class=chromeframe>Your browser is <em>ancient!</em><a href="http://browsehappy.com/">Upgrade to a different browser</a> or<a href="http://www.google.com/chromeframe/?redirect=true">install Google Chrome Frame</a>to experience this site.</p><![endif]-->';
};


/**
 * @param {Object.<string, *>=} opt_data
 * @return {string}
 * @notypecheck
 */
mangoadmin.templates.helper.footer = function(opt_data) {
  return '<footer class="footer span12"><hr><p class="pull-right"><a href="#">Back to top</a></p>' + mangoadmin.templates.helper.credits(null) + '</footer>';
};


/**
 * @param {Object.<string, *>=} opt_data
 * @return {string}
 * @notypecheck
 */
mangoadmin.templates.helper.credits = function(opt_data) {
  return '<p>Designed and built with ★ and ♥ by <a href="http://twitter.com/knutwalker" target="_blank">@knutwalker</a> upon the awesome <a href="http://html5boilerplate.com/" target="_blank">h5bp</a>, <a href="http://twitter.github.com/bootstrap/" target="_blank">bootstrap</a> and <a href="http://code.google.com/closure/" target="_blank">Closure tools</a>.</p><p>Hosted on <a href="http://github.com/" target="_blank">github</a>. Icons from <a target="_blank" href="http://glyphicons.com">Glyphicons Free</a>, licensed under <a target="_blank" href="http://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a>.</p>';
};
