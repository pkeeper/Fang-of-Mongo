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
goog.provide('mangoadmin.collection.json.PrettyPrinter');

goog.require('goog.array');
goog.require('goog.format.JsonPrettyPrinter');
goog.require('goog.format.JsonPrettyPrinter.HtmlDelimiters');

goog.require('soy');




/**
 * @override
 * @constructor
 * @extends {goog.format.JsonPrettyPrinter}
 */
mangoadmin.collection.json.PrettyPrinter = function() {
  goog.base(this, new goog.format.JsonPrettyPrinter.HtmlDelimiters());
};
goog.inherits(mangoadmin.collection.json.PrettyPrinter, goog.format.JsonPrettyPrinter);



/**
 * @override
 */
mangoadmin.collection.json.PrettyPrinter.prototype.printObject_ = function(val,
    outputBuffer, indent) {
  if (goog.typeOf(val) === 'object') {
    var alt = this.restruct_(val);
    if (goog.isArray(alt)) {
      goog.array.forEach(alt, function(el) {
        if (goog.isString(el)) {
          outputBuffer.append(el);
        } else {
          this.printValue_(el.toString(), 'string', outputBuffer);
        }
      }, this);
      return;
    }
  }
  goog.base(this, 'printObject_', val, outputBuffer, indent);
};

/**
 * @param {*} val
 * @return {Array}
 */
mangoadmin.collection.json.PrettyPrinter.prototype.restruct_ = function(val) {
  if (goog.typeOf(val) === 'object') {
    if (val.hasOwnProperty('$date')) {
      var date = new goog.date.DateTime(new Date(val['$date']));
      return [
          new String(date.toUTCIsoString(true))
      ];
    }
    if (val.hasOwnProperty('$oid')) {
      return [
          'ObjectId(',
          new String(soy.$$escapeHtml(val['$oid'])),
          ')'
      ];
    }
    if (val.hasOwnProperty('$regex')) {
      return [
          '/',
          new String(soy.$$escapeHtml(val['$regex'])),
          '/',
          new String(soy.$$escapeHtml(val['$options']))
      ];
    }
    if (val.hasOwnProperty('$binary')) {
      return [
          'BinData(',
          new String(soy.$$escapeHtml(val['$type'])),
          ', ',
          new String(soy.$$escapeHtml(val['$binary'])),
          ')'
      ];
    }
  }
  return null;
};
