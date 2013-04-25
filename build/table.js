define(function() {
  var Table;

  return Table = (function() {
    function Table(table) {
      this.table = table;
      this.rows = {};
      this.rowsById = {};
      this.numberOfRows = 0;
    }

    Table.prototype.header = function(columns) {
      var column, newTr, _i, _len, _results;

      newTr = $('<tr></tr>');
      _results = [];
      for (_i = 0, _len = columns.length; _i < _len; _i++) {
        column = columns[_i];
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
      var newTr, oldTr, x, _i, _len;

      newTr = $('<tr></tr>').attr('data-id', id);
      oldTr = $(this.table).find('tr[data-id=' + id + ']');
      this.getById(id = data);
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        x = data[_i];
        newTr.append($('<td></td>').append($('<span></span>').append(x)));
      }
      return oldTr.html(newTr.html());
    };

    Table.prototype.insert = function(data, id) {
      var tr, x, _i, _len;

      if (id === void 0) {
        id = this.guid();
      }
      tr = $('<tr></tr>').attr('data-id', id);
      this.rows[this.numberOfRows++] = data;
      this.rowsById[id] = data;
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        x = data[_i];
        tr.append($('<td></td>').append($('<span></span>').append(x)));
      }
      return this.table.find('tbody').append(tr);
    };

    Table.prototype.addClassToRow = function(id, className) {
      var row;

      row = this.findRow(id);
      if (!row.hasClass(className)) {
        return row.addClass(className);
      }
    };

    Table.prototype.removeAllClassesFromRow = function(id) {
      var row;

      row = this.findRow(id);
      return row.removeClass();
    };

    Table.prototype.toggleClassToRow = function(id, className) {
      return this.findRow(id).toggleClass(className);
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
});
