var Table;

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
