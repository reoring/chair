var ViewController;

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

    moveMode = MoveModeFactory.create(this.moveModeName);
    this.table = new Table(this.gridId, $(this.tableSelector), moveMode, this.applicationGridService);
    this.table.header(JSON.parse(this.columnConfigJSON));
    moveMode.init(this.table, this.applicationGridService, this.rowSelectedClass);
    this.applicationGridService.change(this.gridId, page, rowsPerGrid);
    DomainEvent.subscribe('GridChanged', function(event, eventName) {
      var row, _i, _len, _ref;

      if (event.gridId === _this.gridId) {
        _ref = event.rows;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          row = _ref[_i];
          _this.table.insert(row.columns, row.id);
        }
      }
      return _this.cursor();
    });
    DomainEvent.subscribe('ColumnUpdated', function(event, eventName) {
      return _this.table.addClassToRow(_this.table.rowIdOfGlobal(event.rowId), _this.rowModifiedClass);
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
    return DomainEvent.subscribe('RowUnselected', function(event, eventName) {
      if (event.gridId === _this.gridId) {
        return _this.table.unselectRow(event.rowId, _this.rowSelectedClass);
      }
    });
  };

  ViewController.prototype.add = function(id, row) {
    return this.grid.append(new Row(id, row));
  };

  ViewController.prototype.selectAll = function() {
    return this.applicationGridService.selectAll(this.gridId);
  };

  ViewController.prototype.unselectAll = function() {
    return this.applicationGridService.unselectAll(this.gridId);
  };

  ViewController.prototype.cursor = function(rowId) {
    if (rowId !== void 0) {
      this.table.cursorRow(rowId);
    }
    return this.table.cursorTop();
  };

  return ViewController;

})();
