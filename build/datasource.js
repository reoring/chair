var AjaxDataSource, ArrayDataSource;

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
