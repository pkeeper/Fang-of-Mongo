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
goog.provide('mangoadmin.collections.Controller');

goog.require('goog.dom');
goog.require('goog.ui.ComboBox');
goog.require('goog.ui.MenuSeparator');
goog.require('goog.ui.Component.EventType');
goog.require('mangoadmin.ui.Page');
goog.require('mangoadmin.ui.CollectionItem');
goog.require('mangoadmin.templates.main');



mangoadmin.collections.Controller = function(server) {
  this.page_ = mangoadmin.ui.Page.getInstance(server);
  this.server_ = server;
};

mangoadmin.collections.Controller.prototype.list = function() {
  var cb = new goog.ui.ComboBox();
  cb.setUseDropdownArrow(true);
  cb.setDefaultText(
      goog.getMsg('Select a collection...')
  );

  var caption = new mangoadmin.ui.CollectionItem(
      goog.getMsg('Select collection...')
  );
  caption.setSticky(true);
  caption.setEnabled(false);

  cb.addItem(caption);

  goog.array.forEach(this.server_['database']['collections'], function(val) {
    cb.addItem(new mangoadmin.ui.CollectionItem(val.name, val));
  });

  cb.addItem(new goog.ui.MenuSeparator());

  var newfolder = new mangoadmin.ui.CollectionItem('New collection...');
  newfolder.setSticky(true);
  cb.addItem(newfolder);

  var el = this.page_.getDomHelper().getElement('mongo_ui_collection_list');
  goog.dom.removeChildren(el);
  cb.render(el);

  cb.getHandler().listen(cb, goog.ui.Component.EventType.CHECK,
      this.collection_
  );
};


mangoadmin.collections.Controller.prototype.collection_ = function(e) {
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
  if (data['resource']) {
    mangoadmin.DataSource.getInstance().setCallback(function(resp){
      console.log('loaded collection', resp);

    }).load(data['resource']);
  }
};
