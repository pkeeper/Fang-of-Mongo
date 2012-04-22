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
goog.provide('mangoadmin.ui.LoginDlg');


goog.require('goog.ui.Dialog');
goog.require('goog.ui.Dialog.ButtonSet');
goog.require('goog.ui.Dialog.EventType');
goog.require('goog.ui.PopupBase.EventType');

goog.require('mangoadmin.templates.ui.login');


/**
 * @param {object=} opt_callbacks
 * @extends {goog.ui,Dialog}
 * @constructor
 */
mangoadmin.ui.LoginDlg = function (opt_callbacks) {
  goog.base(this);

  this.setContent(mangoadmin.templates.ui.login.dialog());
  this.setTitle(goog.getMsg('Welcome to MangoAdmin'));

  this.setButtonSet(new goog.ui.Dialog.ButtonSet().addButton({
    key: 'login',
    caption: goog.getMsg('Login!')
  }, true));

  this.getHandler().listen(this,
      goog.ui.Dialog.EventType.SELECT,
      opt_callbacks.select || function(e) {
        alert('You chose: ' + e.key);
      }
  );

  if (goog.isFunction(opt_callbacks.close)) {
    this.getHandler().listen(this,
        goog.ui.PopupBase.EventType.HIDE,
        opt_callbacks.close
    );
  }

  if (goog.isFunction(opt_callbacks.open)) {
    this.getHandler().listen(this,
        goog.ui.PopupBase.EventType.SHOW,
        opt_callbacks.open
    );
  }
};
goog.inherits(mangoadmin.ui.LoginDlg, goog.ui.Dialog);
