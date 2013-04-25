var GridService;

GridService = (function() {
  function GridService() {}

  GridService.prototype.select = function(gridId, rowId) {
    return DomainRegistry.rowSelectionService().select(gridId, rowId);
  };

  GridService.prototype.unselect = function(gridId, rowId) {
    return DomainRegistry.rowSelectionService().unselect(gridId, rowId);
  };

  return GridService;

})();
