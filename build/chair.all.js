var AjaxDataSource, AllRowSelectedStatus, AllRowUnselectedStatus, ArrayDataSource, Column, ColumnFormat, DomainEvent, DomainRegistry, Grid, GridColumnUpdated, GridRepository, GridRowAppended, GridRowRemoved, GridRowSelected, GridRowUnselected, GridService, Row, RowRepositoryInterface, RowSelectionService, Table, ViewController,
  __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
  __hasProp = {}.hasOwnProperty;

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

GridColumnUpdated = (function() {
  function GridColumnUpdated(gridId, rowId, columnId, columnValue) {
    this.gridId = gridId;
    this.rowId = rowId;
    this.columnId = columnId;
    this.columnValue = columnValue;
  }

  GridColumnUpdated.prototype.serialize = function() {
    return {
      gridId: this.gridId,
      rowId: this.rowId,
      columnId: this.columnId,
      columnValue: this.columnValue
    };
  };

  return GridColumnUpdated;

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
  _gridRepository: null,
  rowSelectionService: function() {
    return new RowSelectionService();
  },
  gridRepository: function() {
    if (this._gridRepository === null) {
      this._gridRepository = new GridRepository();
    }
    return this._gridRepository;
  }
};

Grid = (function() {
  function Grid(id, columns) {
    var column, _i, _len;

    this.id = id;
    this._rows = {};
    this.columns = [];
    for (_i = 0, _len = columns.length; _i < _len; _i++) {
      column = columns[_i];
      this.columns.push(column);
    }
  }

  Grid.prototype.append = function(row) {
    if (this._hasRow(row.id)) {
      throw new Error("Row(id:" + row.id + ") already exists in the Grid(id:" + this.id + ")");
    }
    return this._addRow(row);
  };

  Grid.prototype.updateColumn = function(rowId, columnId, columnValue) {
    if (this._hasRow(rowId)) {
      return this._getRow(rowId).updateColumn(columnId, columnValue, this.id);
    }
  };

  Grid.prototype.rows = function() {
    var key, row;

    return (function() {
      var _ref, _results;

      _ref = this._rows;
      _results = [];
      for (key in _ref) {
        if (!__hasProp.call(_ref, key)) continue;
        row = _ref[key];
        _results.push(row);
      }
      return _results;
    }).call(this);
  };

  Grid.prototype.removeRow = function(rowId) {
    if (this._hasRow(rowId)) {
      this._getRow(rowId).remove();
      return delete this._rows[rowId];
    }
  };

  Grid.prototype._hasRow = function(rowId) {
    if (this._rows[rowId]) {
      return true;
    } else {
      return false;
    }
  };

  Grid.prototype._getRow = function(rowId) {
    return this._rows[rowId];
  };

  Grid.prototype._addRow = function(row) {
    this._rows[row.id] = row;
    row.gridId = this.id;
    return DomainEvent.publish("GridRowAppended", new GridRowAppended(this.id, row.id, row.columns));
  };

  return Grid;

})();

GridRepository = (function() {
  function GridRepository(grids) {
    var grid, _i, _len;

    if (grids == null) {
      grids = [];
    }
    this.grids = {};
    for (_i = 0, _len = grids.length; _i < _len; _i++) {
      grid = grids[_i];
      this.add(grid);
    }
  }

  GridRepository.prototype.gridOfId = function(id, callback) {
    if (!this.grids[id]) {
      callback(null, null);
      return;
    }
    return callback(null, this.grids[id]);
  };

  GridRepository.prototype.add = function(grid) {
    return this.grids[grid.id] = grid;
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

GridRowRemoved = (function() {
  function GridRowRemoved(gridId, rowId) {
    this.gridId = gridId;
    this.rowId = rowId;
    if (!this.gridId) {
      throw new Error("no grid id specified");
    }
    if (!this.rowId) {
      throw new Error("no row id specified");
    }
  }

  GridRowRemoved.prototype.serialize = function() {
    return {
      gridId: this.gridId,
      rowId: this.rowId
    };
  };

  return GridRowRemoved;

})();

GridRowSelected = (function() {
  function GridRowSelected(gridId, rowId) {
    this.gridId = gridId;
    this.rowId = rowId;
    if (!this.gridId) {
      throw new Error("no grid id specified");
    }
    if (!this.rowId) {
      throw new Error("no row id specified");
    }
  }

  GridRowSelected.prototype.serialize = function() {
    return {
      gridId: this.gridId,
      rowId: this.rowId
    };
  };

  return GridRowSelected;

})();

GridRowUnselected = (function() {
  function GridRowUnselected(gridId, rowId) {
    this.gridId = gridId;
    this.rowId = rowId;
    if (!this.gridId) {
      throw new Error("no grid id specified");
    }
    if (!this.rowId) {
      throw new Error("no row id specified");
    }
  }

  GridRowUnselected.prototype.serialize = function() {
    return {
      gridId: this.gridId,
      rowId: this.rowId
    };
  };

  return GridRowUnselected;

})();

Row = (function() {
  function Row(id, columns) {
    var columnId, columnValue;

    this.id = id;
    this.columns = {};
    for (columnId in columns) {
      if (!__hasProp.call(columns, columnId)) continue;
      columnValue = columns[columnId];
      this.columns[columnId] = "" + columnValue;
    }
    this.deleted = false;
    this.gridId = null;
  }

  Row.prototype.updateColumn = function(columnId, columnValue) {
    if (this.columns[columnId]) {
      this.columns[columnId] = columnValue;
      return DomainEvent.publish('GridColumnUpdated', new GridColumnUpdated(this.gridId, this.id, columnId, columnValue));
    }
  };

  Row.prototype.remove = function() {
    this.deleted = true;
    return DomainEvent.publish('GridRowRemoved', new GridRowRemoved(this.gridId, this.id));
  };

  return Row;

})();

RowRepositoryInterface = (function() {
  function RowRepositoryInterface() {}

  RowRepositoryInterface.prototype.rowOfId = function(rowId, callback) {
    if (callback == null) {
      callback = function(error, row) {};
    }
    throw "This method should be implemented by subclass";
  };

  return RowRepositoryInterface;

})();

RowSelectionService = (function() {
  function RowSelectionService() {}

  RowSelectionService.prototype.gridSelectionStatuses = [];

  RowSelectionService.prototype.selectAll = function(gridId) {
    this.gridSelectionStatuses[gridId] = new AllRowSelectedStatus();
    return DomainRegistry.gridRepository().gridOfId(gridId, function(error, grid) {
      var row, _i, _len, _ref, _results;

      if (error) {
        throw new Error(error);
      }
      if (grid === null) {
        return;
      }
      _ref = grid.rows();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        row = _ref[_i];
        _results.push(DomainEvent.publish("GridRowSelected", new GridRowSelected(gridId, row.id)));
      }
      return _results;
    });
  };

  RowSelectionService.prototype.unselectAll = function(gridId) {
    if (!this.gridSelectionStatuses[gridId]) {
      throw new Error('Invalid status transition');
    }
    this.gridSelectionStatuses[gridId] = new AllRowUnselectedStatus();
    return DomainRegistry.gridRepository().gridOfId(gridId, function(error, grid) {
      var row, _i, _len, _ref, _results;

      if (error) {
        throw new Error(error);
      }
      if (grid === null) {
        return;
      }
      _ref = grid.rows();
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        row = _ref[_i];
        _results.push(DomainEvent.publish("GridRowUnselected", new GridRowUnselected(gridId, row.id)));
      }
      return _results;
    });
  };

  RowSelectionService.prototype.select = function(gridId, rowId) {
    if (!this.gridSelectionStatuses[gridId]) {
      this.gridSelectionStatuses[gridId] = new AllRowUnselectedStatus();
    }
    this.gridSelectionStatuses[gridId].select(rowId);
    return DomainEvent.publish("GridRowSelected", new GridRowSelected(gridId, rowId));
  };

  RowSelectionService.prototype.unselect = function(gridId, rowId) {
    if (!this.gridSelectionStatuses[gridId]) {
      throw new Error('Invalid status transition');
    }
    this.gridSelectionStatuses[gridId].unselect(rowId);
    return DomainEvent.publish("GridRowUnselected", new GridRowUnselected(gridId, rowId));
  };

  return RowSelectionService;

})();

GridService = (function() {
  function GridService() {}

  GridService.prototype.select = function(gridId, rowId) {
    return DomainRegistry.rowSelectionService().select(gridId, rowId);
  };

  GridService.prototype.unselect = function(gridId, rowId) {
    return DomainRegistry.rowSelectionService().unselect(gridId, rowId);
  };

  GridService.prototype.selectAll = function(gridId) {
    return DomainRegistry.rowSelectionService().selectAll(gridId);
  };

  GridService.prototype.unselectAll = function(gridId) {
    return DomainRegistry.rowSelectionService().unselectAll(gridId);
  };

  GridService.prototype.updateColumn = function(gridId, rowId, columnId, columnValue) {
    return DomainRegistry.gridRepository().gridOfId(gridId, function(error, grid) {
      if (error) {
        throw new Error(error);
      }
      if (grid === null) {
        return;
      }
      return grid.updateColumn(rowId, columnId, columnValue);
    });
  };

  GridService.prototype.removeRow = function(gridId, rowId) {
    return DomainRegistry.gridRepository().gridOfId(gridId, function(error, grid) {
      if (error) {
        throw new Error(error);
      }
      if (grid === null) {
        return;
      }
      return grid.removeRow(rowId);
    });
  };

  return GridService;

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

  Table.prototype.removeClassFromRow = function(id, className) {
    return this.findRow(id).removeClass(className);
  };

  Table.prototype.removeAllClassesFromRow = function(id) {
    var row;

    row = this.findRow(id);
    return row.removeClass();
  };

  Table.prototype.toggleClassToRow = function(id, className) {
    return this.findRow(id).toggleClass(className);
  };

  Table.prototype.hasClassOfRow = function(id, className) {
    return this.findRow(id).hasClass(className);
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

ViewController = (function() {
  function ViewController(grid, tableSelector, header, rowSelectedClass) {
    var _this = this;

    this.grid = grid;
    this.tableSelector = tableSelector;
    this.header = header;
    this.rowSelectedClass = rowSelectedClass != null ? rowSelectedClass : 'row_selected';
    this.table = new Table($(this.tableSelector));
    this.applicationGridService = new GridService();
    this.table.header(header);
    this.table.listenRowEvent('click', function(id, element) {
      if (_this.table.hasClassOfRow(id, _this.rowSelectedClass)) {
        return _this.applicationGridService.unselect(_this.tableSelector, id);
      } else {
        return _this.applicationGridService.select(_this.tableSelector, id);
      }
    });
    DomainEvent.subscribe('GridRowAppended', function(event, eventName) {
      return _this.table.insert(event.columns, event.rowId);
    });
    DomainEvent.subscribe('GridRowSelected', function(event, eventName) {
      return _this.table.addClassToRow(event.rowId, _this.rowSelectedClass);
    });
    DomainEvent.subscribe('GridRowUnselected', function(event, eventName) {
      return _this.table.removeClassFromRow(event.rowId, _this.rowSelectedClass);
    });
  }

  ViewController.prototype.add = function(id, row) {
    return this.grid.append(new Row(id, row));
  };

  ViewController.prototype.selectAll = function(gridId) {
    return this.applicationGridService.selectAll(gridId);
  };

  ViewController.prototype.unselectAll = function(gridId) {
    return this.applicationGridService.unselectAll(gridId);
  };

  return ViewController;

})();
