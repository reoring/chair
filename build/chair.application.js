var GridService;

GridService = (function() {
  function GridService() {}

  GridService.prototype.select = function(gridId, rowId) {
    return DomainRegistry.rowSelectionService().select(gridId, rowId);
  };

  GridService.prototype.unselect = function(gridId, rowId) {
    return DomainRegistry.rowSelectionService().unselect(gridId, rowId);
  };

  GridService.prototype.selectAll = function(gridId) {
    return DomainRegistry.rowSelectionService().selectAll(gridId);
  };

  GridService.prototype.unselectAll = function(gridId) {
    return DomainRegistry.rowSelectionService().unselectAll(gridId);
  };

  GridService.prototype.updateColumn = function(gridId, rowId, columnId, columnValue) {
    return DomainRegistry.gridRepository().gridOfId(gridId, function(error, grid) {
      if (error) {
        throw new Error(error);
      }
      if (grid === null) {
        return;
      }
      return grid.updateColumn(rowId, columnId, columnValue);
    });
  };

  return GridService;

})();
