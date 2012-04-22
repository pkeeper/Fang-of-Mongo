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
goog.provide('mangoadmin.ui.PageRenderer');

goog.require('goog.debug.Logger');
goog.require('goog.ui.ControlRenderer');



/**
 * @constructor
 * @extends {goog.ui.ControlRenderer}
 */
mangoadmin.ui.PageRenderer = function() {
  goog.base(this);
};
goog.inherits(mangoadmin.ui.PageRenderer, goog.ui.ControlRenderer);
goog.addSingletonGetter(mangoadmin.ui.PageRenderer);


/**
 * @type {string}
 */
mangoadmin.ui.PageRenderer.CSS_CLASS = 'magnoadmin-page';


/** @inheritDoc */
mangoadmin.ui.PageRenderer.prototype.getCssClass = function() {
  return mangoadmin.ui.PageRenderer.CSS_CLASS;
};


/**
 * @param {mangoadmin.ui.Page} staticpage
 * @return {Element}
 */
mangoadmin.ui.PageRenderer.prototype.createDom = function(staticpage) {
  var el = goog.base(this, 'createDom', staticpage);
  var tpl = staticpage.getTemplate();
  var tpl_data = staticpage.getTemplateData();

  el.innerHTML = tpl.call(null, tpl_data);
  return el;
};


/**
 * The logger used by this module.
 * @type {goog.debug.Logger}
 * @private
 */
mangoadmin.ui.PageRenderer.logger_ = goog.debug.Logger.getLogger(
    'mangoadmin.ui.PageRenderer');
