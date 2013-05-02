var AllRowsSelected, AllRowsUnselected, Column, ColumnFormat, ColumnUpdated, DomainEvent, DomainRegistry, Grid, GridChangeService, GridChanged, GridRepository, JQueryAjaxRowRepository, Row, RowAppended, RowRemoved, RowRepository, RowSelected, RowUnselected,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

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
  channels: {
    '*': []
  },
  publish: function(eventName, event) {
    var eventData, subscriber, _i, _j, _len, _len1, _ref, _ref1;

    if (!(eventName in this.channels)) {
      this.channels[eventName] = [];
    }
    eventData = event.serialize();
    _ref = this.channels['*'];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      subscriber = _ref[_i];
      subscriber(eventData, eventName);
    }
    _ref1 = this.channels[eventName];
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      subscriber = _ref1[_j];
      subscriber(eventData, eventName);
    }
    return null;
  },
  subscribe: function(eventName, listener) {
    if (!(eventName in this.channels)) {
      this.channels[eventName] = [];
    }
    this.channels[eventName].push(listener);
    return null;
  }
};

DomainRegistry = {
  _gridRepository: null,
  _rowRepository: null,
  gridRepository: function() {
    if (this._gridRepository === null) {
      this._gridRepository = new GridRepository();
    }
    return this._gridRepository;
  },
  rowRepository: function() {
    return this._rowRepository;
  },
  setRowRepository: function(_rowRepository) {
    this._rowRepository = _rowRepository;
  },
  gridChangeService: function() {
    return new GridChangeService();
  }
};

Grid = (function() {
  var ALL_ROWS_SELECTED, ALL_ROWS_UNSELECTED;

  ALL_ROWS_UNSELECTED = 0;

  ALL_ROWS_SELECTED = 1;

  function Grid(id, columns) {
    var column, _i, _len;

    this.id = id;
    if (!this.id) {
      throw new Error('Grid ID is required');
    }
    this._rows = {};
    this.columns = [];
    for (_i = 0, _len = columns.length; _i < _len; _i++) {
      column = columns[_i];
      this.columns.push(column);
    }
    this.selectionStatus = ALL_ROWS_UNSELECTED;
  }

  Grid.prototype.selectAllRows = function() {
    this.selectionStatus = ALL_ROWS_SELECTED;
    DomainEvent.publish('AllRowsSelected', new AllRowsSelected(this.id));
    return null;
  };

  Grid.prototype.unselectAllRows = function() {
    this.selectionStatus = ALL_ROWS_UNSELECTED;
    DomainEvent.publish('AllRowsUnselected', new AllRowsUnselected(this.id));
    return null;
  };

  Grid.prototype.append = function(row) {
    if (this._hasRow(row.id)) {
      throw new Error("Row(id:" + row.id + ") already exists in the Grid(id:" + this.id + ")");
    }
    this._addRow(row);
    return DomainEvent.publish("RowAppended", new RowAppended(this.id, row.id, row.columns));
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

  Grid.prototype.change = function(rows) {
    var row, _i, _len;

    this._rows = {};
    for (_i = 0, _len = rows.length; _i < _len; _i++) {
      row = rows[_i];
      this._addRow(row);
    }
    return DomainEvent.publish("GridChanged", new GridChanged(this.id, rows));
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
    return row.gridId = this.id;
  };

  return Grid;

})();

RowAppended = (function() {
  function RowAppended(gridId, rowId, columns) {
    var key, value;

    this.gridId = gridId;
    this.rowId = rowId;
    if (!this.gridId) {
      throw new Error('Grid ID is required');
    }
    if (!this.rowId) {
      throw new Error('Row ID is required');
    }
    if (!columns) {
      throw new Error('Column Values are required');
    }
    this.columns = [];
    for (key in columns) {
      value = columns[key];
      this.columns.push(value);
    }
  }

  RowAppended.prototype.serialize = function() {
    return {
      gridId: this.gridId,
      rowId: this.rowId,
      columns: this.columns
    };
  };

  return RowAppended;

})();

AllRowsSelected = (function() {
  function AllRowsSelected(gridId) {
    this.gridId = gridId;
    if (!this.gridId) {
      throw new Error('Grid ID is required');
    }
  }

  AllRowsSelected.prototype.serialize = function() {
    return {
      gridId: this.gridId
    };
  };

  return AllRowsSelected;

})();

AllRowsUnselected = (function() {
  function AllRowsUnselected(gridId) {
    this.gridId = gridId;
    if (!this.gridId) {
      throw new Error('Grid ID is required');
    }
  }

  AllRowsUnselected.prototype.serialize = function() {
    return {
      gridId: this.gridId
    };
  };

  return AllRowsUnselected;

})();

GridChanged = (function() {
  function GridChanged(gridId, rows) {
    var row, _i, _len;

    this.gridId = gridId;
    if (!this.gridId) {
      throw new Error('Grid ID is required');
    }
    if (!rows) {
      throw new Error('Rows are required');
    }
    this.rows = [];
    for (_i = 0, _len = rows.length; _i < _len; _i++) {
      row = rows[_i];
      this.rows.push({
        id: row.id,
        columns: row.columns,
        selected: row.selected
      });
    }
  }

  GridChanged.prototype.serialize = function() {
    return {
      gridId: this.gridId,
      rows: this.rows
    };
  };

  return GridChanged;

})();

GridChangeService = (function() {
  function GridChangeService() {}

  GridChangeService.prototype.change = function(gridId, page, rowsPerGrid) {
    if (!gridId) {
      throw new Error('Grid ID is required');
    }
    if (!page) {
      throw new Error('Page is required');
    }
    if (!rowsPerGrid) {
      throw new Error('Rows Per Grid is required');
    }
    DomainRegistry.gridRepository().gridOfId(gridId, function(error, grid) {
      var condition;

      if (error) {
        throw new Error(error);
      }
      if (grid === null) {
        return;
      }
      condition = {
        gridId: grid.id,
        page: page,
        rowsPerGrid: rowsPerGrid
      };
      return DomainRegistry.rowRepository().rowsSpecifiedBy(condition, function(error, rows) {
        if (error) {
          throw new Error(error);
        }
        return grid.change(rows);
      });
    });
    return null;
  };

  return GridChangeService;

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

Row = (function() {
  function Row(id, columns) {
    var columnId, columnValue,
      _this = this;

    this.id = id;
    this.columns = {};
    for (columnId in columns) {
      if (!__hasProp.call(columns, columnId)) continue;
      columnValue = columns[columnId];
      this.columns[columnId] = "" + columnValue;
    }
    this.deleted = false;
    this.gridId = null;
    this.selected = false;
    DomainEvent.subscribe('AllRowsSelected', function(event) {
      if (event.gridId === _this.gridId) {
        return _this.select();
      }
    });
    DomainEvent.subscribe('AllRowsUnselected', function(event) {
      if (event.gridId === _this.gridId) {
        return _this.unselect();
      }
    });
  }

  Row.prototype.updateColumn = function(columnId, columnValue) {
    if (this.columns[columnId]) {
      this.columns[columnId] = columnValue;
      DomainEvent.publish('ColumnUpdated', new ColumnUpdated(this.gridId, this.id, columnId, columnValue));
    }
    return null;
  };

  Row.prototype.remove = function() {
    this.deleted = true;
    DomainEvent.publish('RowRemoved', new RowRemoved(this.gridId, this.id));
    return null;
  };

  Row.prototype.select = function() {
    if (this.selected === false) {
      this.selected = true;
      DomainEvent.publish('RowSelected', new RowSelected(this.gridId, this.id));
    }
    return null;
  };

  Row.prototype.unselect = function() {
    if (this.selected === true) {
      this.selected = false;
      DomainEvent.publish('RowUnselected', new RowUnselected(this.gridId, this.id));
    }
    return null;
  };

  return Row;

})();

ColumnUpdated = (function() {
  function ColumnUpdated(gridId, rowId, columnId, columnValue) {
    this.gridId = gridId;
    this.rowId = rowId;
    this.columnId = columnId;
    this.columnValue = columnValue;
    if (!this.gridId) {
      throw new Error('Grid ID is required');
    }
    if (!this.rowId) {
      throw new Error('Row ID is reuqired');
    }
    if (!this.columnId) {
      throw new Error('Column ID is required');
    }
    if (!this.columnValue) {
      throw new Error('Column Value is required');
    }
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

RowRemoved = (function() {
  function RowRemoved(gridId, rowId) {
    this.gridId = gridId;
    this.rowId = rowId;
    if (!this.gridId) {
      throw new Error('Grid ID is required');
    }
    if (!this.rowId) {
      throw new Error('Row ID is required');
    }
  }

  RowRemoved.prototype.serialize = function() {
    return {
      gridId: this.gridId,
      rowId: this.rowId
    };
  };

  return RowRemoved;

})();

RowSelected = (function() {
  function RowSelected(gridId, rowId) {
    this.gridId = gridId;
    this.rowId = rowId;
    if (!this.gridId) {
      throw new Error('Grid ID is required');
    }
    if (!this.rowId) {
      throw new Error('Row ID is required');
    }
  }

  RowSelected.prototype.serialize = function() {
    return {
      gridId: this.gridId,
      rowId: this.rowId
    };
  };

  return RowSelected;

})();

RowUnselected = (function() {
  function RowUnselected(gridId, rowId) {
    this.gridId = gridId;
    this.rowId = rowId;
    if (!this.gridId) {
      throw new Error('Grid ID is required');
    }
    if (!this.rowId) {
      throw new Error('Row ID is required');
    }
  }

  RowUnselected.prototype.serialize = function() {
    return {
      gridId: this.gridId,
      rowId: this.rowId
    };
  };

  return RowUnselected;

})();

RowRepository = (function() {
  function RowRepository() {}

  RowRepository.prototype.add = function(row) {};

  RowRepository.prototype.rowOfId = function(gridId, rowId, callback) {};

  return RowRepository;

})();

JQueryAjaxRowRepository = (function(_super) {
  __extends(JQueryAjaxRowRepository, _super);

  function JQueryAjaxRowRepository(ajaxURL) {
    this.ajaxURL = ajaxURL;
    this._grids = {};
  }

  JQueryAjaxRowRepository.prototype.add = function(row) {
    var gridId, rowId;

    if (!row.id) {
      throw new Error("Row ID is not specified");
    }
    if (!row.gridId) {
      throw new Error("Grid ID is not specified");
    }
    gridId = row.gridId;
    rowId = row.id;
    if (!(gridId in this._grids)) {
      this._grids[gridId] = {};
    }
    return this._grids[gridId][rowId] = row;
  };

  JQueryAjaxRowRepository.prototype.rowOfId = function(gridId, rowId, callback) {
    var _ref;

    if (!gridId) {
      throw new Error("Missing argument: gridId");
    }
    if (!rowId) {
      throw new Error("Missing argument: rowId");
    }
    if (((_ref = this._grids[gridId]) != null ? _ref[rowId] : void 0) != null) {
      return callback(null, this._grids[gridId][rowId]);
    } else {
      return callback(null, null);
    }
  };

  JQueryAjaxRowRepository.prototype.rowsSpecifiedBy = function(condition, callback) {
    var _this = this;

    return $.ajax({
      url: this.ajaxURL,
      dataType: 'json',
      success: function(data) {
        var columns, gridId, name, row, rows, rowsForResponse, total, value, _i, _j, _len, _len1, _ref, _ref1, _ref2;

        if (typeof data !== 'object') {
          return callback("Response is not object", null);
        }
        if (!('id' in data)) {
          return callback("Invalid scheme: gridId is missing", null);
        }
        if (!('rows' in data)) {
          return callback("Invalid scheme: rows is missing", null);
        }
        if (!('total' in data)) {
          return callback("Invalid scheme: total is missing", null);
        }
        _ref = data.rows;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          row = _ref[_i];
          if (!row.id) {
            return callback("Row id is missing: " + (JSON.stringify(row)), null);
          }
        }
        gridId = data.id;
        rows = data.rows;
        total = data.total;
        rowsForResponse = [];
        _ref1 = data.rows;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          row = _ref1[_j];
          if (((_ref2 = _this._grids[gridId]) != null ? _ref2[row.id] : void 0) != null) {
            rowsForResponse.push(_this._grids[gridId][row.id]);
          } else {
            columns = {};
            for (name in row) {
              if (!__hasProp.call(row, name)) continue;
              value = row[name];
              if (name !== 'id') {
                columns[name] = value;
              }
            }
            rowsForResponse.push(new Row(row.id, columns));
          }
        }
        callback(null, rowsForResponse);
        return null;
      },
      error: function(xhr, status, error) {
        return callback(error, null);
      }
    });
  };

  return JQueryAjaxRowRepository;

})(RowRepository);
