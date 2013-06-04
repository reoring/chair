var ViewController, ViewEvent;

ViewController = (function() {
  function ViewController(gridId, columnConfigJSON, ajaxURL, tableSelector, rowSelectedClass, moveModeName) {
    this.gridId = gridId;
    this.columnConfigJSON = columnConfigJSON;
    this.tableSelector = tableSelector;
    this.rowSelectedClass = rowSelectedClass != null ? rowSelectedClass : 'row_selected';
    this.moveModeName = moveModeName;
    this.rowModifiedClass = 'row_modified';
    this.applicationGridService = new GridService;
    this.applicationGridService.startup(this.gridId, columnConfigJSON, ajaxURL);
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

      _this.table.removeAllRowsWithout('filter');
      if (event.gridId === _this.gridId) {
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
    DomainEvent.subscribe('RowSelected', function(event, eventName) {
      if (event.gridId === _this.gridId) {
        return _this.table.selectRow(event.rowId, _this.rowSelectedClass);
      }
    });
    DomainEvent.subscribe('RowUnselected', function(event, eventName) {
      if (event.gridId === _this.gridId) {
        return _this.table.unselectRow(event.rowId, _this.rowSelectedClass);
      }
    });
    return ViewEvent.subscribe('ViewFilterChanged', function(event, eventName) {
      return _this.applicationGridService.change(_this.gridId, _this.page, _this.rowsPerGrid, JSON.stringify(event));
    });
  };

  ViewController.prototype.add = function(rowId, values) {
    return this.applicationGridService.append(this.gridId, rowId, values);
  };

  ViewController.prototype.save = function(rowId) {
    return this.applicationGridService.save(this.gridId, rowId);
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
    return this.applicationGridService.change(this.gridId, this.page, this.rowsPerGrid);
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
