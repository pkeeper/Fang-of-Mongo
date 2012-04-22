// Copyright 2012 Paul Horn.
//
// This file is part of MangoAdmin.
//
// MangoAdmin is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// MangoAdmin is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with MangoAdmin.  If not, see <http://www.gnu.org/licenses/gpl.html>.

/**
 * @fileoverview
 *
 */
goog.provide('mangoadmin.ui.Page');

goog.require('goog.debug.Logger');
goog.require('goog.dom');
goog.require('goog.ui.Component.State');
goog.require('goog.ui.Control');
goog.require('goog.ui.registry');
goog.require('mangoadmin.ui.PageRenderer');



/**
 * A control that displays a page.StaticPage.
 * @param {{buildinfo:Object}} server
 * @constructor
 * @extends {goog.ui.Control}
 */
mangoadmin.ui.Page = function(server) {
  goog.base(this, null /* content */, null);
  var item = {
    id: 'ui',
    title: 'UI Page',
    template: mangoadmin.templates.main.ui,
    tpl_data: server['buildinfo']
  };

  this.setModel(item);

  //  this.setSupportedState(goog.ui.Component.State.CHECKED, true);
  //  this.setDispatchTransitionEvents(goog.ui.Component.State.CHECKED, true);

  this.setSupportedState(goog.ui.Component.State.FOCUSED, false);
  this.setSupportedState(goog.ui.Component.State.HOVER, false);
  this.setSupportedState(goog.ui.Component.State.DISABLED, false);
  this.setSupportedState(goog.ui.Component.State.ACTIVE, false);
};
goog.inherits(mangoadmin.ui.Page, goog.ui.Control);

mangoadmin.ui.Page.getInstance = function(opt_server) {
  if (mangoadmin.ui.Page.instance_) {
    return mangoadmin.ui.Page.instance_;
  }
  mangoadmin.ui.Page.instance_ = new mangoadmin.ui.Page(opt_server);

  if (!mangoadmin.ui.Page.instance_.isInDocument()) {
    //noinspection JSValidateTypes
    var el = goog.dom.getElement('container');
    goog.dom.removeChildren(el);
    mangoadmin.ui.Page.instance_.render(el);
  }
  return mangoadmin.ui.Page.instance_;
};


/**
 * @return {!langtrain.model.page.StaticPageItem}
 * @override
 */
mangoadmin.ui.Page.prototype.getModel;


/**
 * @return {function(opt_data=)}
 */
mangoadmin.ui.Page.prototype.getTemplate = function() {
  return this.getModel().template;
};


/**
 * @return {Object}
 */
mangoadmin.ui.Page.prototype.getTemplateData = function() {
  return this.getModel().tpl_data;
};


/**
 * @return {string}
 */
mangoadmin.ui.Page.prototype.getId = function() {
  return this.getModel().id;
};


/**
 * @return {string}
 */
mangoadmin.ui.Page.prototype.getTitle = function() {
  return this.getModel().title;
};


goog.ui.registry.setDefaultRenderer(mangoadmin.ui.Page,
    mangoadmin.ui.PageRenderer);
goog.ui.registry.setDecoratorByClassName(
    mangoadmin.ui.PageRenderer.CSS_CLASS,
    function() { return new mangoadmin.ui.Page(); }
);


/**
 * The logger used by this module.
 * @type {goog.debug.Logger}
 * @private
 */
mangoadmin.ui.Page.logger_ = goog.debug.Logger.getLogger(
    'mangoadmin.ui.Page');
