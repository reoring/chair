class ViewController
	constructor: (@grid, @tableSelector, @header, @rowSelectedClass = 'row_selected') ->
		@table = new Table $(@tableSelector)

		@applicationGridService = new GridService()
		
		@table.header header

		@table.listenRowEvent 'click', (id, element) =>
			if @table.hasClassOfRow id, @rowSelectedClass
				@applicationGridService.unselect @tableSelector, id
			else
				@applicationGridService.select @tableSelector, id


		@table.listenCellEvent 'click', (rowId, element) =>
			columnName = element.attr('data-column')
			@table.toCellEdit rowId, columnName


		DomainEvent.subscribe 'GridRowAppended', (event, eventName)=>
			@table.insert event.columns, event.rowId

		DomainEvent.subscribe 'GridRowSelected', (event, eventName)=>
			@table.addClassToRow event.rowId, @rowSelectedClass

		DomainEvent.subscribe 'GridRowUnselected', (event, eventName)=>
			@table.removeClassFromRow event.rowId, @rowSelectedClass

	add: (id, row)->
		@grid.append new Row(id, row)

	selectAll: (gridId) ->
		@applicationGridService.selectAll(gridId)

	unselectAll: (gridId) ->
		@applicationGridService.unselectAll(gridId)