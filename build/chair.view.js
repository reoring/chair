var ViewController;

ViewController = (function() {
  function ViewController(tableSelector, header, rowSelectedClass) {
    var _this = this;

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

  return ViewController;

})();
