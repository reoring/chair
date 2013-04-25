(function() {
  define(function() {
    var Chair;

    return Chair = (function() {
      function Chair(table) {
        this.table = table;
        this.rows = {};
        this.rowsById = {};
        this.numberOfRows = 0;
      }

      Chair.prototype.get = function(index) {
        return this.rows[index];
      };

      Chair.prototype.getById = function(id) {
        return this.rowsById[id];
      };

      Chair.prototype.removeById = function(id) {
        var data;

        $(this.table).find('tr[data-id=' + id + ']').remove;
        data = this.getById(id);
        delete this.rowsById[id];
        return data;
      };

      Chair.prototype.updateById = function(id, data) {
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

      Chair.prototype.insert = function(data, id) {
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

      return Chair;

    })();
  });

}).call(this);
