var ExcelMoveMode, MoveModeFactory, SequenceMoveMode, Table, TableUIHelper;

Table = (function() {
  function Table(table, moveMode, gridService) {
    var _this = this;

    this.table = table;
    this.moveMode = moveMode;
    this.gridService = gridService;
    this.rows = {};
    this.rowsById = {};
    this.numberOfRows = 0;
    this.currentCursor = void 0;
    $(document).on('keydown', function(event) {
      var currentRow, nextRow;

      currentRow = _this.findRow(_this.currentCursor);
      if (currentRow.length === 0) {
        return;
      }
      if (event.which === 32) {
        event.preventDefault();
        if (currentRow.hasClass('row_selected')) {
          _this.gridService.unselect(_this.selector(), currentRow.attr('data-id'));
        } else {
          _this.gridService.select(_this.selector(), currentRow.attr('data-id'));
        }
      }
      if (event.which === 40) {
        event.preventDefault();
        nextRow = currentRow.next();
        if (nextRow.length !== 0) {
          return _this.cursorRow(nextRow.attr('data-id'));
        }
      } else if (event.which === 38) {
        event.preventDefault();
        nextRow = currentRow.prev();
        if (nextRow.length !== 0) {
          return _this.cursorRow(nextRow.attr('data-id'));
        }
      }
    });
  }

  Table.prototype.selector = function() {
    return this.table.selector;
  };

  Table.prototype.header = function(columns) {
    var column, newTr, _base, _base1, _i, _len, _ref;

    this.columns = columns;
    newTr = $('<tr></tr>');
    if (typeof (_base = this.moveMode).beforeHeader === "function") {
      _base.beforeHeader(newTr);
    }
    _ref = this.columns;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      column = _ref[_i];
      newTr.append($('<th></th>').attr('data-column-id', column.id).append($('<span></span>').append(column.title)));
      this.table.find('thead').append(newTr);
    }
    return typeof (_base1 = this.moveMode).afterHeader === "function" ? _base1.afterHeader(newTr) : void 0;
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

  Table.prototype.updateById = function(rowId, data) {
    var columnIndex, id, newTr, oldTr, x, _i, _len;

    id = this.rowIdOfGlobal(rowId);
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

  Table.prototype.cursorRow = function(rowId) {
    if (this.currentCursor === void 0) {
      this.addClassToRow(rowId, 'current');
    } else {
      this.removeClassFromRow(this.currentCursor, 'current');
      this.addClassToRow(rowId, 'current');
    }
    return this.currentCursor = rowId;
  };

  Table.prototype.rowIdOfGlobal = function(rowId) {
    return this.selector().replace('#', '') + '_' + rowId;
  };

  Table.prototype.insert = function(data, id) {
    var columnIndex, rowId, tr, x, _base, _base1, _i, _len;

    if (id === void 0) {
      id = this.guid();
    }
    rowId = this.rowIdOfGlobal(id);
    tr = $('<tr></tr>').attr('data-id', rowId);
    if (typeof (_base = this.moveMode).beforeInsert === "function") {
      _base.beforeInsert(rowId, tr);
    }
    this.rows[this.numberOfRows++] = data;
    this.rowsById[id] = data;
    columnIndex = 0;
    for (_i = 0, _len = data.length; _i < _len; _i++) {
      x = data[_i];
      tr.append(this.createRowColumn(this.columns[columnIndex], x));
      columnIndex++;
    }
    this.table.find('tbody').append(tr);
    return typeof (_base1 = this.moveMode).afterInsert === "function" ? _base1.afterInsert(rowId, tr) : void 0;
  };

  Table.prototype.createRowColumn = function(column, value) {
    var td;

    td = $('<td></td>');
    td.addClass(column).attr('data-column', column.id);
    td.attr('data-column-editable', column.editable);
    if (column.editable === false) {
      td.addClass('disabled');
    }
    return td.append($('<span></span>').append(value));
  };

  Table.prototype.selectRow = function(rowId, cssClass) {
    var _base, _base1;

    if (typeof (_base = this.moveMode).beforeRowSelect === "function") {
      _base.beforeRowSelect(rowId);
    }
    this.addClassToRow(rowId, cssClass);
    return typeof (_base1 = this.moveMode).afterRowSelect === "function" ? _base1.afterRowSelect(rowId) : void 0;
  };

  Table.prototype.unselectRow = function(rowId, cssClass) {
    var _base, _base1;

    if (typeof (_base = this.moveMode).beforeRowUnselect === "function") {
      _base.beforeRowUnselect(rowId);
    }
    this.removeClassFromRow(rowId, cssClass);
    return typeof (_base1 = this.moveMode).afterRowUnselect === "function" ? _base1.afterRowUnselect(rowId) : void 0;
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

  Table.prototype.findRow = function(rowId) {
    return $(this.table).find('tr[data-id=' + rowId + ']');
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

  Table.prototype.toRowEdit = function(rowId) {
    var row;

    return row = this.findRow(rowId);
  };

  Table.prototype.toCellEdit = function(rowId, columnId) {
    var column, row;

    row = this.findRow(rowId);
    column = row.find("td[data-column=" + columnId + "]");
    if (this.isCellEditable(column)) {
      return this._editCell(column);
    }
  };

  Table.prototype.isCellEditable = function(column) {
    return column.attr('data-column-editable') === 'true';
  };

  Table.prototype._editPreviousCell = function(column) {
    column = this.searchEditableColumnToBackward(column);
    if (column === false) {
      return false;
    }
    if (this.isCellEditable(column)) {
      return this._editCell(column);
    }
  };

  Table.prototype.searchEditableColumnToBackward = function(column, depth) {
    var numberOfChildren, parent, prevColumn;

    if (depth == null) {
      depth = 1;
    }
    if (depth > 20) {
      return false;
    }
    prevColumn = column.prev();
    if (this.isCellEditable(prevColumn)) {
      return prevColumn;
    }
    if (prevColumn.length === 0) {
      parent = column.parent().prev();
      numberOfChildren = parent.children().length;
      prevColumn = $(parent.children()[numberOfChildren - 1]);
      if (this.isCellEditable(prevColumn)) {
        return prevColumn;
      }
    }
    return this.searchEditableColumnToBackward(prevColumn, depth + 1);
  };

  Table.prototype.searchEditableColumnToForward = function(column, depth) {
    var nextColumn, nextRow;

    if (depth == null) {
      depth = 1;
    }
    if (depth > 20) {
      return false;
    }
    nextColumn = column.next();
    if (this.isCellEditable(nextColumn)) {
      return nextColumn;
    }
    if (nextColumn.length === 0) {
      nextRow = column.parent().next();
      nextColumn = $(nextRow.children()[0]);
      if (this.isCellEditable(nextColumn)) {
        return nextColumn;
      }
    }
    return this.searchEditableColumnToForward(nextColumn, depth + 1);
  };

  Table.prototype._editNextCell = function(column) {
    column = this.searchEditableColumnToForward(column);
    if (column === false) {
      return false;
    }
    if (this.isCellEditable(column)) {
      return this._editCell(column);
    }
  };

  Table.prototype._editCell = function(column) {
    var input, _base;

    if (column === false) {
      return false;
    }
    input = $('<input type="text"></input>').val(column.text());
    TableUIHelper.fitInputToCell(input, column);
    column.find("span").replaceWith(input);
    input.select();
    return typeof (_base = this.moveMode).move === "function" ? _base.move(input, column) : void 0;
  };

  Table.prototype.listenCellEvent = function(eventName, callback) {
    return this.table.on(eventName, 'td', function() {
      var id;

      id = $(this).parents('tr').attr('data-id');
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

TableUIHelper = (function() {
  function TableUIHelper() {}

  TableUIHelper.fitInputToCell = function(input, column) {
    var ULTRA_COSMIC_CONST_NUMBER, borderBottom, borderLeft, borderRight, borderTop, paddingBottom, paddingLeft, paddingRight, paddingTop;

    paddingLeft = parseInt(column.css('paddingLeft'), 10);
    paddingRight = parseInt(column.css('paddingRight'), 10);
    paddingTop = parseInt(column.css('paddingTop'), 10);
    paddingBottom = parseInt(column.css('paddingBottom'), 10);
    borderLeft = parseInt(column.css('borderLeft'), 10);
    borderRight = parseInt(column.css('borderRight'), 10);
    borderTop = parseInt(column.css('borderTop'), 10);
    borderBottom = parseInt(column.css('borderBottom'), 10);
    ULTRA_COSMIC_CONST_NUMBER = 2;
    input.css('marginLeft', paddingLeft * -1);
    input.css('marginRight', paddingRight * -1);
    input.css('marginTop', (paddingTop + borderTop + ULTRA_COSMIC_CONST_NUMBER) * -1);
    input.css('marginBottom', paddingBottom * -1);
    input.width(column.width() + paddingLeft + paddingRight);
    return input.height(column.height() + paddingTop + paddingBottom + borderTop);
  };

  return TableUIHelper;

})();

ExcelMoveMode = (function() {
  function ExcelMoveMode() {}

  ExcelMoveMode.prototype.init = function(table, applicationGridService, rowSelectedClass) {
    var _this = this;

    this.table = table;
    this.applicationGridService = applicationGridService;
    this.rowSelectedClass = rowSelectedClass;
    return this.table.listenCellEvent('click', function(rowId, element) {
      var columnName;

      columnName = element.attr('data-column');
      return _this.table.toCellEdit(rowId, columnName);
    });
  };

  ExcelMoveMode.prototype.beforeHeader = function(tr) {
    var input,
      _this = this;

    input = $('<input></input>').attr('type', 'checkbox');
    input.on('click', function() {
      var checkbox;

      checkbox = $(_this);
      if (checkbox.prop('checked')) {
        _this.applicationGridService.unselectAll(_this.table.selector());
        return checkbox.prop('checked', false);
      } else {
        _this.applicationGridService.selectAll(_this.table.selector());
        return checkbox.prop('checked', true);
      }
    });
    return tr.append($('<td></td>').append(input));
  };

  ExcelMoveMode.prototype.beforeInsert = function(id, tr) {
    var input,
      _this = this;

    input = $('<input></input>').attr('type', 'checkbox');
    input.attr('data-row-id', id);
    input.on('click', function() {
      if (_this.table.hasClassOfRow(id, _this.rowSelectedClass)) {
        return _this.applicationGridService.unselect(_this.table.selector(), id);
      } else {
        return _this.applicationGridService.select(_this.table.selector(), id);
      }
    });
    return tr.append($('<td></td>').append(input));
  };

  ExcelMoveMode.prototype.beforeRowSelect = function(id) {
    return $('input[data-row-id=' + id + ']').prop('checked', true);
  };

  ExcelMoveMode.prototype.beforeRowUnselect = function(id) {
    return $('input[data-row-id=' + id + ']').prop('checked', false);
  };

  ExcelMoveMode.prototype.move = function(input, column) {
    var _this = this;

    input.on('keydown', function(event) {
      var nextColumn, nextRow, prevColumn, prevRow;

      if (event.which === 9) {
        event.preventDefault();
        input.replaceWith($('<span></span>').text(input.val()));
        if (event.shiftKey === true) {
          _this.table._editPreviousCell(column);
        } else {
          _this.table._editNextCell(column);
        }
      }
      if (event.which === 13) {
        input.replaceWith($('<span></span>').text(input.val()));
        if (event.shiftKey === true) {
          prevRow = $(column.parent().prev());
          prevColumn = prevRow.find('td[data-column=' + column.attr('data-column') + ']');
          return _this.table._editCell(prevColumn);
        } else {
          nextRow = $(column.parent().next());
          nextColumn = nextRow.find('td[data-column=' + column.attr('data-column') + ']');
          return _this.table._editCell(nextColumn);
        }
      }
    });
    return input.on('blur', function() {
      return input.replaceWith($('<span></span>').text(input.val()));
    });
  };

  return ExcelMoveMode;

})();

MoveModeFactory = (function() {
  function MoveModeFactory() {}

  MoveModeFactory.classes = {
    excel: ExcelMoveMode,
    sequence: SequenceMoveMode
  };

  MoveModeFactory.create = function(name) {
    return new this.classes[name];
  };

  return MoveModeFactory;

})();

SequenceMoveMode = (function() {
  function SequenceMoveMode() {}

  SequenceMoveMode.prototype.move = function(input, column, table) {
    var _this = this;

    input.on('keypress', function(event) {
      if (event.which === 13) {
        input.replaceWith($('<span></span>').text(input.val()));
        if (column.next().length === 0) {
          return table._editCell($(column.parent().next().find('td')[0]));
        } else {
          return table._editCell(column.next());
        }
      }
    });
    return input.on('blur', function() {
      return input.replaceWith($('<span></span>').text(input.val()));
    });
  };

  return SequenceMoveMode;

})();
