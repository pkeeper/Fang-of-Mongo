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
goog.provide('mangoadmin');

goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.ui.Dialog');
goog.require('goog.ui.Dialog.ButtonSet');
goog.require('goog.ui.Dialog.EventType');
goog.require('goog.ui.PopupBase.EventType');
goog.require('goog.style');
goog.require('mangoadmin.templates.ui.login');


/**
 * @define {string}  The Version Number.  Future version will set this on a
 * git-basis.
 */
mangoadmin.VERSION = '0.1.0';


/**
 * Beam me up, Scotty!
 */
mangoadmin.main = function() {
  var start_app = goog.dom.getElement('start-app');
  var login = new goog.ui.Dialog();
  login.setContent(mangoadmin.templates.ui.login.dialog());
  login.setTitle(goog.getMsg('Welcome to MangoAdmin'));

  login.setButtonSet(new goog.ui.Dialog.ButtonSet().
      addButton({
        key: 'login',
        caption: goog.getMsg('Login!')
    }, true));

  goog.events.listen(login, goog.ui.Dialog.EventType.SELECT, function(e) {
    alert('You chose: ' + e.key);
  });
  goog.events.listen(login, goog.ui.PopupBase.EventType.HIDE, function(e) {
    goog.style.showElement(start_app, true);
  });


  // do actual stuff
  goog.style.showElement(start_app, false);
  login.setVisible(true);
};

goog.exportSymbol('mangoadmin.main', mangoadmin.main);
