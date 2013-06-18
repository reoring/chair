var ViewController, ViewEvent,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

ViewController = (function() {
  function ViewController(gridId, columnConfigJSON, ajaxURL, ajaxCommandURL, tableSelector, rowSelectedClass, moveModeName) {
    this.gridId = gridId;
    this.columnConfigJSON = columnConfigJSON;
    this.tableSelector = tableSelector;
    this.rowSelectedClass = rowSelectedClass != null ? rowSelectedClass : 'row_selected';
    this.moveModeName = moveModeName;
    this.additionalFilter = __bind(this.additionalFilter, this);
    this.movePageTo = __bind(this.movePageTo, this);
    this.rowModifiedClass = 'row_modified';
    this.applicationGridService = new GridService;
    this.applicationGridService.startup(this.gridId, columnConfigJSON, ajaxURL, ajaxCommandURL);
    this.selectedRows = {};
    this.filter = void 0;
    this._additionalFilter = null;
    this.sort = null;
    this.direction = null;
  }

  ViewController.prototype.startup = function(page, rowsPerGrid) {
    var moveMode,
      _this = this;

    this.page = page;
    this.rowsPerGrid = rowsPerGrid;
    moveMode = MoveModeFactory.create(this.moveModeName);
    this.table = new Table(this.gridId, $(this.tableSelector), moveMode, this.applicationGridService, this.columnConfigJSON);
    this.table.header(JSON.parse(this.columnConfigJSON));
    moveMode.init(this.table, this.applicationGridService, this.rowSelectedClass);
    this.applicationGridService.change(this.gridId, page, rowsPerGrid);
    if (!this.table.filterRowExists()) {
      this.table.setFilterRow();
    }
    DomainEvent.subscribe('GridChanged', function(event, eventName) {
      var columnId, row, _i, _j, _len, _len1, _ref, _ref1;

      if (event.gridId !== _this.gridId) {
        return null;
      }
      _this.table.removeAllRowsWithout('filter');
      _ref = event.rows;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        row = _ref[_i];
        _this.table.insert(row.columns, row.id);
        if (row.selected === true) {
          _this.table.selectRow(row.id, _this.rowSelectedClass);
        }
        _ref1 = row.updatedColumns;
        for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
          columnId = _ref1[_j];
          _this.table.addClassToColumn(_this.table.rowIdOfGlobal(row.id), columnId, 'column_modified');
        }
        if (event.rows.length > 0) {
          _this.cursor();
        }
      }
      return null;
    });
    DomainEvent.subscribe('ColumnUpdated', function(event, eventName) {
      return _this.table.addClassToColumn(_this.table.rowIdOfGlobal(event.rowId), event.columnId, 'column_modified');
    });
    DomainEvent.subscribe('RowAppended', function(event, eventName) {
      if (event.gridId === _this.gridId) {
        return _this.table.insert(event.columns, event.rowId);
      }
    });
    DomainEvent.subscribe('RowRemoved', function(event, eventName) {
      return _this.table.removeRow(event.gridId + '.' + event.rowId);
    });
    DomainEvent.subscribe('RowSaved', function(event, eventName) {
      return _this.table.removeClassFromRowColumns(event.gridId + '.' + event.rowId, 'column_modified');
    });
    DomainEvent.subscribe('RowSelected', function(event, eventName) {
      if (event.gridId === _this.gridId) {
        _this.table.selectRow(event.rowId, _this.rowSelectedClass);
      }
      return _this.selectedRows[event.rowId] = true;
    });
    DomainEvent.subscribe('RowUnselected', function(event, eventName) {
      if (event.gridId === _this.gridId) {
        _this.table.unselectRow(event.rowId, _this.rowSelectedClass);
      }
      return delete _this.selectedRows[event.rowId];
    });
    ViewEvent.subscribe('ViewFilterChanged', function(event, eventName) {
      if (event.tableId !== _this.gridId) {
        return;
      }
      _this.filter = JSON.stringify(event.filterConditions);
      return _this.applicationGridService.change(_this.gridId, _this.page, _this.rowsPerGrid, _this.filter, _this._additionalFilter, _this.sort, _this.direction);
    });
    return ViewEvent.subscribe('ViewSortChanged', function(event, eventName) {
      if (event.tableId !== _this.gridId) {
        return;
      }
      _this.sort = event.columnId;
      _this.direction = event.direction;
      return _this.applicationGridService.change(_this.gridId, _this.page, _this.rowsPerGrid, _this.filter, _this._additionalFilter, _this.sort, _this.direction);
    });
  };

  ViewController.prototype.add = function(rowId, values) {
    return this.applicationGridService.append(this.gridId, rowId, values);
  };

  ViewController.prototype.save = function(rowId) {
    return this.applicationGridService.save(this.gridId, rowId);
  };

  ViewController.prototype.remove = function(rowId) {
    return this.applicationGridService.removeRow(this.gridId, rowId);
  };

  ViewController.prototype.removeSelectedRows = function() {
    var id, value, _ref, _results;

    _ref = this.selectedRows;
    _results = [];
    for (id in _ref) {
      value = _ref[id];
      _results.push(this.remove(id));
    }
    return _results;
  };

  ViewController.prototype.saveAll = function() {
    return this.applicationGridService.saveAll(this.gridId);
  };

  ViewController.prototype.selectAll = function() {
    return this.applicationGridService.selectAll(this.gridId);
  };

  ViewController.prototype.unselectAll = function() {
    return this.applicationGridService.unselectAll(this.gridId);
  };

  ViewController.prototype.movePageTo = function(page) {
    this.page = page;
    return this.applicationGridService.change(this.gridId, this.page, this.rowsPerGrid, this.filter, this._additionalFilter, this.sort, this.direction);
  };

  ViewController.prototype.additionalFilter = function(_additionalFilter) {
    this._additionalFilter = _additionalFilter;
    return this.applicationGridService.change(this.gridId, this.page, this.rowsPerGrid, this.filter, this._additionalFilter, this.sort, this.direction);
  };

  ViewController.prototype.cursor = function(rowId) {
    if (rowId !== void 0) {
      this.table.cursorRow(rowId);
    }
    return this.table.cursorTop();
  };

  return ViewController;

})();

ViewEvent = {
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
