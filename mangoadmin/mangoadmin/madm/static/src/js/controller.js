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
goog.provide('mangoadmin.controller');


goog.require('goog.dom');
goog.require('goog.dom.forms');
goog.require('goog.style');
goog.require('goog.Uri');

goog.require('mangoadmin.collection.Controller');
goog.require('mangoadmin.DataSource');
goog.require('mangoadmin.selection.Controller');
goog.require('mangoadmin.ui.LoginDlg');



mangoadmin.controller.login = function() {
  var start_app = goog.dom.getElement('start-app'),
      login = new mangoadmin.ui.LoginDlg({
        close: function() {
          goog.style.showElement(start_app, true);
        },
        open: function() {
          goog.dom.forms.focusAndSelect(
              document.querySelector('input[name=host]')
          )
        },
        select: function() {
          var apiurl;
          if (goog.isDefAndNotNull(apiurl = goog.getObjectByName('document.body.dataset.apiurl'))) {
            var formMap = goog.dom.forms.getFormDataMap(goog.dom.getElement('login-form')),
                loader = function (resp) {
                  console.log('loaded server', resp['server']);
                  mangoadmin.controller.server(resp['server']);
                },
                resource = new goog.Uri(
                    apiurl.replace("host:0", "{$host}:{$port}")
                        .replace('{$host}', formMap.get('host'))
                        .replace('{$port}', formMap.get('port'))
                );
            mangoadmin.DataSource.load(resource, loader);
          }
        }
      });

  goog.style.showElement(start_app, false);
  login.setVisible(true);
};


mangoadmin.controller.server = function(server) {
  (new mangoadmin.selection.Controller(server)).list({
        default_text  : goog.getMsg('Select a database...'),
        caption_text  : goog.getMsg('Select database...'),
        server_item   : 'databases',
        new_text      : goog.getMsg('New database...'),
        render_to     : 'databases-list',
        select        : function(resp) {
          console.log('loaded database', resp);
          mangoadmin.controller.database(resp['server']);
        }
  });
};

mangoadmin.controller.database = function(server) {
  (new mangoadmin.selection.Controller(server)).list({
        default_text  : goog.getMsg('Select a collection...'),
        caption_text  : goog.getMsg('Select a collection...'),
        server_item   : 'database.collections',
        new_text      : goog.getMsg('New collection...'),
        render_to     : 'collection-list',
        select        : function(resp){
          console.log('loaded collection', resp);
          (new mangoadmin.collection.Controller(resp)).drawTabs();
        }
  });
};
