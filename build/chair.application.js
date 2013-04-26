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

  return GridService;

})();
