var GridService;

GridService = (function() {
  function GridService() {}

  GridService.prototype.select = function(gridId, rowId) {
    DomainRegistry.rowRepository().rowOfId(gridId, rowId, function(error, row) {
      if (error) {
        throw new Error(error);
      }
      if (row === null) {
        return null;
      }
      return row.select();
    });
    return null;
  };

  GridService.prototype.unselect = function(gridId, rowId) {
    DomainRegistry.rowRepository().rowOfId(gridId, rowId, function(error, row) {
      if (error) {
        throw new Error(error);
      }
      if (row === null) {
        return null;
      }
      return row.unselect();
    });
    return null;
  };

  GridService.prototype.selectAll = function(gridId) {
    DomainRegistry.gridRepository().gridOfId(gridId, function(error, grid) {
      if (error) {
        throw new Error(error);
      }
      if (grid === null) {
        return null;
      }
      return grid.selectAllRows();
    });
    return null;
  };

  GridService.prototype.unselectAll = function(gridId) {
    DomainRegistry.gridRepository().gridOfId(gridId, function(error, grid) {
      if (error) {
        throw new Error(error);
      }
      if (grid === null) {
        return null;
      }
      return grid.unselectAllRows();
    });
    return null;
  };

  GridService.prototype.updateColumn = function(gridId, rowId, columnId, columnValue) {
    DomainRegistry.gridRepository().gridOfId(gridId, function(error, grid) {
      if (error) {
        throw new Error(error);
      }
      if (grid === null) {
        return null;
      }
      return grid.updateColumn(rowId, columnId, columnValue);
    });
    return null;
  };

  GridService.prototype.removeRow = function(gridId, rowId) {
    DomainRegistry.gridRepository().gridOfId(gridId, function(error, grid) {
      if (error) {
        throw new Error(error);
      }
      if (grid === null) {
        return null;
      }
      return grid.removeRow(rowId);
    });
    return null;
  };

  GridService.prototype.change = function(gridId, page, rowsPerGrid) {
    if (!gridId) {
      throw new Error('Grid ID is required');
    }
    if (!page) {
      throw new Error('Page is required');
    }
    if (!rowsPerGrid) {
      throw new Error('Rows Per Grid is required');
    }
    DomainRegistry.gridChangeService().change(gridId, page, rowsPerGrid);
    return null;
  };

  return GridService;

})();
