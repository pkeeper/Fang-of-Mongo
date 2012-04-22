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

goog.require('goog.dom');
goog.require('goog.structs.Map');
goog.require('goog.ui.Component.State');
goog.require('goog.ui.Control');
goog.require('goog.ui.registry');
goog.require('mangoadmin.ui.PageRenderer');
goog.require('mangoadmin.templates.helper');



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

mangoadmin.ui.Page.getInstance = function(opt_server, opt_doNotRender) {
  var inst;
  if (mangoadmin.ui.Page.instance_) {
    inst = mangoadmin.ui.Page.instance_;
  } else {
    mangoadmin.ui.Page.instance_ = inst = new mangoadmin.ui.Page(opt_server);
  }
  if (!(inst.isInDocument() || opt_doNotRender)) {
    //noinspection JSValidateTypes
    var el = goog.dom.getElement('container');
    goog.dom.removeChildren(el);
    inst.render(el);
    goog.dom.getElement('mongodb-info').innerHTML =
    mangoadmin.templates.helper.serverinfo(opt_server['buildinfo']);
  }
  return inst;
};

mangoadmin.ui.Page.dropInstance = function() {
  if (mangoadmin.ui.Page.instance_) {
    var page = mangoadmin.ui.Page.instance_;
    if (page.isInDocument()) {
      page.removeChildren(true);
      page.exitDocument();
      page.dispose();
    }
    mangoadmin.ui.Page.instance_ = page = null;
  }
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


/**
 * @override
 * @return {number}  the last index
 */
mangoadmin.ui.Page.prototype.addChild = function(child, opt_render) {
  goog.base(this, 'addChild', child, opt_render);
  return this.getChildCount() - 1;
};


/**
 *
 * @param {number} key
 * @param {goog.ui.Component} child
 */
mangoadmin.ui.Page.prototype.safeAddChild = function(key, child) {
  if (mangoadmin.ui.Page.handledChilds_.containsKey(key)) {

    var prevIdx = mangoadmin.ui.Page.handledChilds_.get(key);

    if (this.hasChildren() && this.getChildCount() > prevIdx) {
      this.removeChildAt(prevIdx, true);
    }

    this.addChildAt(child, prevIdx, false /* do not render */);

  } else {

    mangoadmin.ui.Page.handledChilds_.set(key,
        this.addChild(child, false /* do not render */)
    )

  }
};

mangoadmin.ui.Page.handledChilds_ = new goog.structs.Map();


goog.ui.registry.setDefaultRenderer(mangoadmin.ui.Page,
    mangoadmin.ui.PageRenderer);
goog.ui.registry.setDecoratorByClassName(
    mangoadmin.ui.PageRenderer.CSS_CLASS,
    function() { return new mangoadmin.ui.Page(); }
);
