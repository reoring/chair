var AllRowSelectedStatus, AllRowUnselectedStatus, Column, ColumnFormat, ColumnUpdated, DomainEvent, DomainRegistry, Grid, GridRepository, GridRowAppended, GridRowSelected, GridRowUnselected, Row, RowRepositoryInterface, RowSelectionService,
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

ColumnUpdated = (function() {
  function ColumnUpdated(gridId, rowId, columnId, columnValue) {
    this.gridId = gridId;
    this.rowId = rowId;
    this.columnId = columnId;
    this.columnValue = columnValue;
  }

  ColumnUpdated.prototype.serialize = function() {
    return {
      gridId: this.gridId,
      rowId: this.rowId,
      columnId: this.columnId,
      columnValue: this.columnValue
    };
  };

  return ColumnUpdated;

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
    this._setRow(row);
    return DomainEvent.publish("GridRowAppended", new GridRowAppended(this.id, row.id, row.columns));
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

  Grid.prototype._setRow = function(row) {
    return this._rows[row.id] = row;
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
  }

  Row.prototype.updateColumn = function(columnId, columnValue, gridId) {
    if (this.columns[columnId]) {
      this.columns[columnId] = columnValue;
      return DomainEvent.publish('ColumnUpdated', new ColumnUpdated(gridId, this.id, columnId, columnValue));
    }
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
