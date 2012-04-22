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
 * @fileoverview calls the server and provides result
 *
 */
goog.provide('mangoadmin.DataSource');

goog.require('goog.net.XhrIo');
goog.require('goog.net.EventType');
goog.require('goog.events');
goog.require('goog.net.XhrIo');


/**
 * The Model for a mongoDB server.  This is merely a wrapper for
 * goog.ds.JsXmlHttpDataSource that abstracts some behavior.
 *
 * @constructor
 */
mangoadmin.DataSource = function() {
  /**
   * The XHR I/O instance that calls the server
   * @type {goog.net.XhrIo}
   * @private
   */
  this.ds_ = new goog.net.XhrIo();

  goog.events.listen(this.getDataSource(), goog.net.EventType.COMPLETE,
      goog.bind(this.complete_, this)
  );
};
goog.addSingletonGetter(mangoadmin.DataSource);

/* properties */

/**
 * Whether to ignore the cache and thus, forcing to fire a request.
 *
 * @type {boolean}
 * @private
 */
mangoadmin.DataSource.prototype.ignoreCache_ = false;


/**
 * The callback that is called upon completion of the request. It gets bound
 * to the Model instance.
 *
 * @type {function(this:mangoadmin.DataSource)}
 * @private
 */
mangoadmin.DataSource.prototype.callback_ = null;



/* getters */

/**
 * @return {goog.net.XhrIo}
 * @private
 */
mangoadmin.DataSource.prototype.getDataSource = function() {
  return this.ds_;
};

/**
 * @return {boolean}  Whether to ignore the cache.
 */
mangoadmin.DataSource.prototype.isIgnoreCache = function() {
  return this.ignoreCache_;
};

/**
 * @return {function(this:mangoadmin.DataSource)}  The user-defined callback.
 */
mangoadmin.DataSource.prototype.getCallback = function() {
  return this.callback_;
};


/* setters */

/**
 * @param {boolean} ignoreCache
 * @return {mangoadmin.DataSource}
 */
mangoadmin.DataSource.prototype.setIgnoreCache = function(ignoreCache) {
  this.ignoreCache_ = ignoreCache;
  return this;
};

/**
 * @param {function(this:mangoadmin.DataSource)} callback
 * @return {mangoadmin.DataSource}
 */
mangoadmin.DataSource.prototype.setCallback = function(callback) {
  this.callback_ = callback;
  return this;
};


/* internal helpers */


/**
 * This is called after the request completes and is responsible for calling
 * the user-defined callback with the appropriate binding and arguments.
 *
 * @private
 */
mangoadmin.DataSource.prototype.complete_ = function() {
  var resp = this.getDataSource().getResponseJson(),
      cb = this.getCallback();

  if (goog.isDef(resp)) {
    mangoadmin.DataSource.cache_[this.getDataSource().getLastUri()] = resp;
    if (goog.isFunction(cb)) {
      cb.call(this, resp);
    }
  }
};


/**
 * This fires does the whole loading.  If there is no callback specified,
 * simply fail silently.  If there is a cached value and ignoreCache_ is
 * false, then return the cached value.  Otherwise fire a request (delegated
 * to {@code goog.netXhrIo}) and handle the result in bindCallback_.
 * Either way, this function return immediately, i.e. it is non-blocking.
 *
 * @param {(string|goog.Uri)} uri  URI for the resource
 */
mangoadmin.DataSource.prototype.load = function(uri) {
  var cb = this.getCallback();

  if (goog.isFunction(cb)) {
    if (this.isIgnoreCache() ||
        !goog.isDefAndNotNull(mangoadmin.DataSource.cache_[uri])) {

      this.getDataSource().send(uri);

    } else {
      setTimeout(function () {
        cb.call(this, mangoadmin.DataSource.cache_[uri]);
      }, 0);
    }
  }
};


/**
 * The result cache as a static property.  A value other than null or
 * undefined represents a valid cache.
 *
 * @type {Array}
 * @private
 */
mangoadmin.DataSource.cache_ = {};





/**
 * Shortcut for loading a resource
 *
 * @param {(string|goog.Uri)} resource  URI for the resource
 * @param {function(this:mangoadmin.DataSource)} callback
 */
mangoadmin.DataSource.load = function(resource, callback) {
  mangoadmin.DataSource.getInstance().setCallback(callback).load(resource);
};
