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
goog.provide('mangoadmin.collection.Controller');


goog.require('goog.array');
goog.require('goog.dom');
goog.require('goog.events');
goog.require('goog.events.EventType');
goog.require('goog.string');
goog.require('goog.ui.Zippy');
goog.require('goog.ui.Component.EventType');
goog.require('goog.ui.TabBar');

goog.require('mangoadmin.collection.json.PrettyPrinter');
goog.require('mangoadmin.templates.ui.collections');



mangoadmin.collection.Controller = function(server) {
  this.page_ = mangoadmin.ui.Page.getInstance(server['server']);
  this.server_ = server;

  goog.dom.getElement('collection-content').innerHTML = mangoadmin.templates.ui.collections.tabbar();
};

mangoadmin.collection.Controller.prototype.drawTabs = function () {
  var tabBar = new goog.ui.TabBar();

  // Handle SELECT events dispatched by tabs.
  tabBar.getHandler().listen(tabBar, goog.ui.Component.EventType.SELECT,
      function (e) {
        var tabSelected = e.target;
        console.log('You selected the "' + tabSelected.getCaption() + '" tab.');
      });

  var idKey = goog.string.hashCode('goog-tabbar');
  this.page_.safeAddChild(idKey, tabBar);

  tabBar.decorate(goog.dom.getElement('collection-bar'));

  var f = new mangoadmin.collection.json.PrettyPrinter(),
      contentContainer = goog.dom.getElement('collection-bar-content');

  contentContainer.innerHTML = (
      mangoadmin.templates.ui.collections.data({
        'results': goog.array.map(this.server_['query']['result'], function (res) {
          return {
            _fmt: f.format(res),
            _id: f.format(res['_id'])
          }
        })
      })
  );

  var headers = goog.dom.getElementsByClass('result-header', contentContainer),
      contents = goog.dom.getElementsByClass('result-content', contentContainer),
      zippies = goog.array.map(headers, function(el, idx) {
        return new goog.ui.Zippy(el, contents[idx], false);
      }),
      nextZippyState = true,
      expanderTitleMap = {
        'true': goog.getMsg('expand'),
        'false': goog.getMsg('collapse')
      };


  goog.events.listen(goog.dom.getElement('result-expand'),
      goog.events.EventType.CLICK,
      function(e) {
        goog.array.forEach(zippies, function(zip) {
          zip.setExpanded(nextZippyState);
        });
        nextZippyState = !nextZippyState;
        goog.dom.setTextContent(e.target, expanderTitleMap[nextZippyState]);
      }
  );

  var callback = function(resp) {
        (new mangoadmin.collection.Controller(resp)).drawTabs();
      },
      resource = this.server_['query']['resource_uri'];


  goog.events.listen(goog.dom.getElement('result-refresh'),
      goog.events.EventType.CLICK,
      function(e) {
        mangoadmin.DataSource.load(resource, callback);
      }
  );

};

