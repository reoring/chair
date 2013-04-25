var AjaxDataSource, ArrayDataSource, InMemoryGridRepository,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

AjaxDataSource = (function() {
  function AjaxDataSource(url) {
    this.url = url;
  }

  AjaxDataSource.prototype.retrieve = function(callback, parameter) {
    return $.get(this.url, parameter, function(response) {
      return callback(response);
    });
  };

  return AjaxDataSource;

})();

ArrayDataSource = (function() {
  function ArrayDataSource() {}

  ArrayDataSource.prototype.retrieve = function(callback, parameter) {
    return callback([["suin", 26], ["reoring", 300], ["nouphet", 300000]]);
  };

  return ArrayDataSource;

})();

InMemoryGridRepository = (function(_super) {
  __extends(InMemoryGridRepository, _super);

  function InMemoryGridRepository() {
    this.grids = {};
  }

  InMemoryGridRepository.prototype.gridOfId = function(id, callback) {
    if (__indexOf.call(this.grids, id) < 0) {
      return callback(null, "grid not found of id(" + id + ")");
    } else {
      return callback(this.grids[id], null);
    }
  };

  return InMemoryGridRepository;

})(GridRepository);
