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
goog.require('goog.style');
goog.require('mangoadmin.login.controller');


/**
 * @define {string}  The Version Number.  Future version will set this on a
 * git-basis.
 */
mangoadmin.VERSION = '0.1.0';


/**
 * Beam me up, Scotty!
 */
mangoadmin.main = function() {
  mangoadmin.login.controller.main();
};

goog.exportSymbol('mangoadmin.main', mangoadmin.main);
