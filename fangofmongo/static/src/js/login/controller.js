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
goog.provide('mangoadmin.login.controller');


goog.require('mangoadmin.login.Ui');
goog.require('goog.dom');
goog.require('goog.dom.forms');
goog.require('mangoadmin.DataSource');

mangoadmin.login.controller.main = function() {
  var start_app = goog.dom.getElement('start-app'),
      login = new mangoadmin.login.Ui({
        close: function() {
          goog.style.showElement(start_app, true);
        },
        open: function() {
          goog.dom.forms.focusAndSelect(
              document.querySelector('input[name=host]')
          )
        },
        select: mangoadmin.login.controller.load
      });

  goog.style.showElement(start_app, false);
  login.setVisible(true);
};

mangoadmin.login.controller.load = function() {
  //TODO: get URL from somewhere
  var formMap = goog.dom.forms.getFormDataMap(goog.dom.getElement('login-form'));
  //noinspection JSValidateTypes
  mangoadmin.DataSource.getInstance().setCallback(function(resp){
    console.log(resp);
  }).load(
      '/api/' + formMap.get('host') + ':' + formMap.get('port') + '.json'
  );
};
