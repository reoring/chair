var Column, ColumnFormat, DomainEvent, Grid, GridRowAppended, Row,
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

    columnValue = this.escapeHTML(columnValue);
    _ref = this.formats;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      format = _ref[_i];
      columnValue = format.format(columnValue);
    }
    return columnValue;
  };

  Column.prototype.escapeHTML = function(string) {
    return string.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
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

DomainEvent = {
  channels: [],
  publish: function(eventName, event) {
    var subscriber, _i, _len, _ref, _results;

    if (this.channels[eventName] === void 0) {
      this.channels[eventName] = [];
    }
    _ref = this.channels[eventName];
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      subscriber = _ref[_i];
      _results.push(subscriber(event.serialize(), eventName));
    }
    return _results;
  },
  subscribe: function(eventName, listener) {
    if (this.channels[eventName] === void 0) {
      this.channels[eventName] = [];
    }
    return this.channels[eventName].push(listener);
  }
};

Grid = (function() {
  function Grid(id, columns) {
    var column, _i, _len;

    this.id = id;
    this.rows = [];
    this.rowIds = [];
    this.columns = [];
    for (_i = 0, _len = columns.length; _i < _len; _i++) {
      column = columns[_i];
      this.columns.push(column);
    }
  }

  Grid.prototype.append = function(row) {
    var _ref;

    if (_ref = row.id, __indexOf.call(this.rowIds, _ref) >= 0) {
      throw new Error("Row(id:" + row.id + ") already exists in the Grid(id:" + this.id + ")");
    }
    this.rowIds.push(row.id);
    this.rows.push(row);
    return DomainEvent.publish("GridRowAppended", new GridRowAppended(this.id, row.id, row.columns));
  };

  return Grid;

})();

GridRowAppended = (function() {
  function GridRowAppended(gridId, rowId, columns) {
    var key, value;

    this.gridId = gridId;
    this.rowId = rowId;
    this.columns = [];
    for (key in columns) {
      value = columns[key];
      this.columns.push(value);
    }
  }

  GridRowAppended.prototype.serialize = function() {
    return {
      gridId: this.gridId,
      rowId: this.rowId,
      columns: this.columns
    };
  };

  return GridRowAppended;

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
