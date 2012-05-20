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
goog.provide('mangoadmin.selection.Controller');

goog.require('goog.array');
goog.require('goog.string');
goog.require('goog.object');
goog.require('goog.ui.ComboBox');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.MenuSeparator');

goog.require('mangoadmin.DataSource');
goog.require('mangoadmin.ui.CollectionItem');
goog.require('mangoadmin.ui.Page');



mangoadmin.selection.Controller = function(server) {
  this.page_ = mangoadmin.ui.Page.getInstance(server);
  this.server_ = server;
};

mangoadmin.selection.Controller.prototype.list = function(specs) {
  var cb = new goog.ui.ComboBox();
  cb.setUseDropdownArrow(true);
  cb.setDefaultText(specs.default_text);

  var caption = new mangoadmin.ui.CollectionItem(specs.caption_text);
  caption.setSticky(true);
  caption.setEnabled(false);

  cb.addItem(caption);

  var content = goog.getObjectByName(specs.server_item, this.server_);
  if (goog.isArrayLike(content)) {
    goog.array.forEach(content, function(val) {
      cb.addItem(new mangoadmin.ui.CollectionItem(val.name, val));
    });
  }

  cb.addItem(new goog.ui.MenuSeparator());

  var newfolder = new mangoadmin.ui.CollectionItem(specs.new_text);
  newfolder.setSticky(true);
  cb.addItem(newfolder);

  cb.getHandler().listen(cb, goog.ui.Component.EventType.CHECK,
      goog.bind(this.select_, cb, specs.select)
  );

  var idKey = goog.string.hashCode(goog.object.getValues(specs).join(''));
  this.page_.safeAddChild(idKey, cb);

  var el = this.page_.getDomHelper().getElement(specs.render_to);
  cb.render(el);
};


mangoadmin.selection.Controller.prototype.select_ = function(callback, e) {
  var data = e.target.getValue(),
      child_data;
  this.getMenu().forEachChild(function(child) {
    if (child.getValue && (child_data = child.getValue())['name']) {
      if (child_data['name'] != data['name']) {
        child.setChecked(false);
      }
    }
  });
  console.log('you chose: ', data);
  if (data['resource_uri']) {
    mangoadmin.DataSource.load(data['resource_uri'], callback);
  }
};
