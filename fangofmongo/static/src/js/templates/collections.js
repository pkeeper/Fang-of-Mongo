// This file was automatically generated from collections.soy.
// Please don't edit this file by hand.

goog.provide('mangoadmin.templates.ui.collections');

goog.require('soy');


/**
 * @param {Object.<string, *>=} opt_data
 * @return {string}
 * @notypecheck
 */
mangoadmin.templates.ui.collections.tabbar = function(opt_data) {
  return '<div id="collection-bar" class="goog-tab-bar goog-tab-bar-top"><div class="goog-tab goog-tab-selected">Data</div><div class="goog-tab">Stats</div><div class="goog-tab">Indexes</div></div><div class="goog-tab-bar-clear"></div><div id="collection-bar-content" class="goog-tab-content">Use the keyboard or the mouse to switch tabs.</div>';
};


/**
 * @param {Object.<string, *>=} opt_data
 * @return {string}
 * @notypecheck
 */
mangoadmin.templates.ui.collections.data = function(opt_data) {
  var output = '<div class="container" style="width:auto;"><div class="pull-right"><span><a href="#" id="result-expand">expand</a></span> <span><a href="#" id="result-refresh">refresh</a></span></div><div class="pagination"><ul><li><a href="#">&laquo;</a></li><li class="active"><a href="#">1</a></li><li><a href="#">2</a></li><li><a href="#">3</a></li><li><a href="#">4</a></li><li><a href="#">&raquo;</a></li></ul></div></div>';
  var resultList9 = opt_data.results;
  var resultListLen9 = resultList9.length;
  for (var resultIndex9 = 0; resultIndex9 < resultListLen9; resultIndex9++) {
    var resultData9 = resultList9[resultIndex9];
    output += ((resultIndex9 == 0) ? '<table class="table table-striped"><tbody>' : '') + '<tr class="result-header"><td>' + resultData9._id + '</td></tr><tr class="result-content"><td><pre class="pre-scrollable">' + resultData9._fmt + '</pre></td></tr>' + ((resultIndex9 == resultListLen9 - 1) ? '</tbody></table>' : '');
  }
  return output;
};
