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
goog.provide('mangoadmin.ui.CollectionItem');

goog.require('goog.ui.ComboBoxItem');
goog.require('goog.ui.Component.State');

/**
 * Class for Collection Items
 * @param {goog.ui.ControlContent} content Text caption or DOM structure to
 *     display as the content of the item (use to add icons or styling to
 *     menus).
 * @param {Object=} opt_data Identifying data for the menu item.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional dom helper used for dom
 *     interactions.
 * @constructor
 * @extends {goog.ui.ComboBoxItem}
 */
mangoadmin.ui.CollectionItem = function (content, opt_data, opt_domHelper) {
  goog.base(this, content, opt_data, opt_domHelper);
  this.setSupportedState(goog.ui.Component.State.CHECKED, true);
  this.setDispatchTransitionEvents(goog.ui.Component.State.CHECKED, true);
};
goog.inherits(mangoadmin.ui.CollectionItem, goog.ui.ComboBoxItem);