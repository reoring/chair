var Column, ColumnFormat, Grid, Row,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

Column = (function() {
  function Column(columnId, name, formats) {
    if (formats == null) {
      formats = [];
    }
    this.id = columnId;
    this.name = name;
    this.formats = formats;
  }

  Column.prototype.format = function(columnValue) {
    var format, _i, _len, _ref;

    _ref = this.formats;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      format = _ref[_i];
      columnValue = format.format(columnValue);
    }
    return columnValue;
  };

  return Column;

})();

ColumnFormat = (function() {
  function ColumnFormat(formatter) {
    this.formatter = formatter;
  }

  ColumnFormat.prototype.format = function(columnValue) {
    return this.formatter(columnValue);
  };

  return ColumnFormat;

})();

Grid = (function() {
  function Grid(id) {
    this.id = id;
    this.rows = [];
    this.rowIds = [];
  }

  Grid.prototype.append = function(row) {
    var _ref;

    if (_ref = row.id, __indexOf.call(this.rowIds, _ref) >= 0) {
      throw new Error("Row(id:" + row.id + ") already exists in the Grid(id:" + this.id + ")");
    }
    this.rowIds.push(row.id);
    return this.rows.push(row);
  };

  return Grid;

})();

Row = (function() {
  function Row(id, columns) {
    var columnId, columnValue;

    this.id = id;
    this.columns = {};
    for (columnId in columns) {
      columnValue = columns[columnId];
      this.columns[columnId] = "" + columnValue;
    }
  }

  return Row;

})();
