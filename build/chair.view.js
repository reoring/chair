var ViewController;

ViewController = (function() {
  function ViewController(grid, tableSelector, header, rowSelectedClass, moveModeName) {
    var moveMode,
      _this = this;

    this.grid = grid;
    this.tableSelector = tableSelector;
    this.header = header;
    this.rowSelectedClass = rowSelectedClass != null ? rowSelectedClass : 'row_selected';
    moveMode = MoveModeFactory.create(moveModeName);
    this.applicationGridService = new GridService;
    this.table = new Table($(this.tableSelector), moveMode, this.applicationGridService);
    this.table.header(header);
    moveMode.init(this.table, this.applicationGridService, this.rowSelectedClass);
    DomainEvent.subscribe('RowAppended', function(event, eventName) {
      if (event.gridId === _this.tableSelector) {
        return _this.table.insert(event.columns, event.rowId);
      }
    });
    DomainEvent.subscribe('RowSelected', function(event, eventName) {
      if (event.gridId === _this.tableSelector) {
        return _this.table.selectRow(event.rowId, _this.rowSelectedClass);
      }
    });
    DomainEvent.subscribe('RowUnselected', function(event, eventName) {
      if (event.gridId === _this.tableSelector) {
        return _this.table.unselectRow(event.rowId, _this.rowSelectedClass);
      }
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

  ViewController.prototype.cursor = function(rowId) {
    return this.table.cursorRow(rowId);
  };

  return ViewController;

})();
