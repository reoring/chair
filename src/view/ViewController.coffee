class ViewController
	constructor: (@tableSelector, @header, @rowSelectedClass = 'row_selected') ->
		@table = new Table $(@tableSelector)

		@applicationGridService = new GridService()
		
		@table.header header

		@table.listenRowEvent 'click', (id, element) =>
			if @table.hasClassOfRow id, @rowSelectedClass
				@applicationGridService.unselect(@tableSelector, id)
			else
				@applicationGridService.select(@tableSelector, id)
			
			@table.toggleClassToRow(id, @rowSelectedClass)


		DomainEvent.subscribe 'GridRowAppended', (event, eventName)=>
			@table.insert event.columns, event.rowId