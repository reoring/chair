var GridService;

GridService = (function() {
  function GridService() {}

  GridService.prototype.startup = function(gridId, columnsConfig, ajaxQueryURL, ajaxCommandURL) {
    var columns, config, formats, grid, _i, _len;

    if (!gridId) {
      throw new Error('Grid ID is required');
    }
    if (!columnsConfig) {
      throw new Error('Columns Config are required');
    }
    if (!ajaxQueryURL) {
      throw new Error('Ajax Query URL is required');
    }
    if (!ajaxCommandURL) {
      ajaxCommandURL = ajaxQueryURL;
    }
    columnsConfig = JSON.parse(columnsConfig);
    columns = [];
    for (_i = 0, _len = columnsConfig.length; _i < _len; _i++) {
      config = columnsConfig[_i];
      formats = [];
      columns.push(new Column(config.id, config.title, formats));
    }
    grid = new Grid(gridId, columns);
    DomainRegistry.gridRepository().add(grid);
    DomainRegistry.setRowRepository(new JQueryAjaxRowRepository(ajaxQueryURL, ajaxCommandURL));
    return null;
  };

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

  GridService.prototype.save = function(gridId, rowId) {
    var rowRepository,
      _this = this;

    rowRepository = DomainRegistry.rowRepository();
    rowRepository.save(gridId, rowId, function(error, row) {
      if (error) {
        throw new Error(error);
      }
      if (row === null) {
        return null;
      }
    });
    return null;
  };

  GridService.prototype.saveAll = function(gridId) {
    var rowRepository;

    rowRepository = DomainRegistry.rowRepository();
    return rowRepository.saveAll(gridId);
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

  GridService.prototype.append = function(gridId, rowId, columnValues) {
    DomainRegistry.gridRepository().gridOfId(gridId, function(error, grid) {
      if (error) {
        throw new Error(error);
      }
      if (grid === null) {
        return null;
      }
      return grid.append(new Row(rowId, columnValues));
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

  GridService.prototype.change = function(gridId, page, rowsPerGrid, filter, additionalFilter, sort, direction) {
    if (!gridId) {
      throw new Error('Grid ID is required');
    }
    if (!page) {
      throw new Error('Page is required');
    }
    if (!rowsPerGrid) {
      throw new Error('Rows Per Grid is required');
    }
    DomainRegistry.gridChangeService().change(gridId, page, rowsPerGrid, filter, additionalFilter, sort, direction);
    return null;
  };

  return GridService;

})();
