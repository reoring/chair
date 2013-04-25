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
        newTr.append($('<td></td>').append(column));
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

      $(this.table).find('tr[data-id=' + id + ']').remove;
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
        newTr.append($('<td></td>').append(x));
      }
      return oldTr.html(newTr.html());
    };

    Table.prototype.insert = function(data, id) {
      var tr, x, _i, _len;

      tr = $('<tr></tr>').attr('data-id', id);
      this.rows[this.numberOfRows++] = data;
      if (id != null) {
        this.rowsById[id] = data;
      }
      for (_i = 0, _len = data.length; _i < _len; _i++) {
        x = data[_i];
        tr.append($('<td></td>').append(x));
      }
      return this.table.find('tbody').append(tr);
    };

    return Table;

  })();
});
