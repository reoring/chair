var AjaxDataSource, AllRowSelectedStatus, AllRowUnselectedStatus, ArrayDataSource, Column, ColumnFormat, DomainEvent, DomainRegistry, Grid, GridRepository, GridRowAppended, InMemoryGridRepository, Row, RowSelectionService, Table,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

AllRowSelectedStatus = (function() {
  function AllRowSelectedStatus() {
    this.unselectedRows = [];
  }

  AllRowSelectedStatus.prototype.select = function(rowId) {
    var index;

    if (__indexOf.call(this.unselectedRows, rowId) >= 0) {
      index = this.unselectedRows.indexOf(rowId);
      return this.unselectedRows.splice(index, 1);
    }
  };

  AllRowSelectedStatus.prototype.unselect = function(rowId) {
    if (__indexOf.call(this.unselectedRows, rowId) < 0) {
      return this.unselectedRows.push(rowId);
    }
  };

  return AllRowSelectedStatus;

})();

AllRowUnselectedStatus = (function() {
  function AllRowUnselectedStatus() {
    this.selectedRows = [];
  }

  AllRowUnselectedStatus.prototype.select = function(rowId) {
    if (__indexOf.call(this.selectedRows, rowId) < 0) {
      return this.selectedRows.push(rowId);
    }
  };

  AllRowUnselectedStatus.prototype.unselect = function(rowId) {
    var index;

    if (__indexOf.call(this.selectedRows, rowId) >= 0) {
      index = this.selectedRows.indexOf(rowId);
      return this.selectedRows.splice(index, 1);
    }
  };

  return AllRowUnselectedStatus;

})();

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

DomainRegistry = {
  rowSelectionService: function() {
    return new RowSelectionService();
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

GridRepository = (function() {
  function GridRepository() {}

  GridRepository.prototype.gridOfId = function(id, callback) {
    throw "must be implemented by subclass";
  };

  return GridRepository;

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

RowSelectionService = (function() {
  function RowSelectionService() {}

  RowSelectionService.prototype.gridSelectionStatuses = [];

  RowSelectionService.prototype.selectAll = function(gridId) {
    return this.gridSelectionStatuses[gridId] = new AllRowSelectedStatus();
  };

  RowSelectionService.prototype.unselectedAll = function(gridId) {
    if (!this.gridSelectionStatuses[gridId]) {
      throw new Error('Invalid status trasition');
    }
    return this.gridSelectionStatuses[gridId] = new AllRowUnselectedStatus();
  };

  RowSelectionService.prototype.select = function(gridId, rowId) {
    if (!this.gridSelectionStatuses[gridId]) {
      this.gridSelectionStatuses[gridId] = new AllRowUnselectedStatus();
    }
    return this.gridSelectionStatuses[gridId].select(rowId);
  };

  RowSelectionService.prototype.unselect = function(gridId, rowId) {
    if (!this.gridSelectionStatuses[gridId]) {
      throw new Error('Invalid status trasition');
    }
    return this.gridSelectionStatuses[gridId].unselect(rowId);
  };

  return RowSelectionService;

})();

Table = (function() {
  function Table(table) {
    this.table = table;
    this.rows = {};
    this.rowsById = {};
    this.numberOfRows = 0;
  }

  Table.prototype.header = function(columns) {
    var column, newTr, _i, _len, _ref, _results;

    this.columns = columns;
    newTr = $('<tr></tr>');
    _ref = this.columns;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      column = _ref[_i];
      newTr.append($('<th></th>').append($('<span></span>').append(column)));
      _results.push(this.table.find('thead').append(newTr));
    }
    return _results;
  };

  Table.prototype.get = function(index) {
    return this.rows[index];
  };

  Table.prototype.getById = function(id) {
    return this.rowsById[id];
  };

  Table.prototype.removeById = function(id) {
    var data;

    this.findRow(id).remove;
    data = this.getById(id);
    delete this.rowsById[id];
    return data;
  };

  Table.prototype.updateById = function(id, data) {
    var columnIndex, newTr, oldTr, x, _i, _len;

    newTr = $('<tr></tr>').attr('data-id', id);
    oldTr = $(this.table).find('tr[data-id=' + id + ']');
    this.getById(id = data);
    columnIndex = 0;
    for (_i = 0, _len = data.length; _i < _len; _i++) {
      x = data[_i];
      newTr.append(this.createRowColumn(this.columns[columnIndex], x));
      columnIndex++;
    }
    return oldTr.html(newTr.html());
  };

  Table.prototype.insert = function(data, id) {
    var columnIndex, tr, x, _i, _len;

    if (id === void 0) {
      id = this.guid();
    }
    tr = $('<tr></tr>').attr('data-id', id);
    this.rows[this.numberOfRows++] = data;
    this.rowsById[id] = data;
    columnIndex = 0;
    for (_i = 0, _len = data.length; _i < _len; _i++) {
      x = data[_i];
      tr.append(this.createRowColumn(this.columns[columnIndex], x));
      columnIndex++;
    }
    return this.table.find('tbody').append(tr);
  };

  Table.prototype.createRowColumn = function(column, value) {
    return $('<td></td>').addClass(column).append($('<span></span>').append(value));
  };

  Table.prototype.addClassToRow = function(id, className) {
    var row;

    row = this.findRow(id);
    if (!row.hasClass(className)) {
      return row.addClass(className);
    }
  };

  Table.prototype.removeAllClassesFromRow = function(id) {
    var row;

    row = this.findRow(id);
    return row.removeClass();
  };

  Table.prototype.toggleClassToRow = function(id, className) {
    return this.findRow(id).toggleClass(className);
  };

  Table.prototype.findRow = function(id) {
    return $(this.table).find('tr[data-id=' + id + ']');
  };

  Table.prototype.listen = function(id, eventName, callback) {
    return this.findRow(id).on(eventName, function() {
      return callback(id, $(this));
    });
  };

  Table.prototype.listenRowEvent = function(eventName, callback) {
    return this.table.on(eventName, 'tr', function() {
      var id;

      id = $(this).attr('data-id');
      return callback(id, $(this));
    });
  };

  Table.prototype.listenTextEvent = function(eventName, callback) {
    return this.table.find('span').on(eventName, function() {
      var id;

      id = $(this).parents('tr').attr('data-id');
      callback(id, $(this));
      return false;
    });
  };

  Table.prototype.s4 = function() {
    return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
  };

  Table.prototype.guid = function() {
    return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' + this.s4() + this.s4() + this.s4();
  };

  return Table;

})();

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
