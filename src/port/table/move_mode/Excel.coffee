class ExcelMoveMode
	move: (input, column, table) ->
		input.on 'keypress', (event) ->
			if event.which == 13
				input.replaceWith $('<span></span>').text input.val()

				if event.shiftKey == true
					prevRow = $ column.parent().prev()
					prevColumn = prevRow.find('td[data-column=' + column.attr('data-column') + ']')

					table._editCell prevColumn
				else
					nextRow = $ column.parent().next()
					nextColumn = nextRow.find('td[data-column=' + column.attr('data-column') + ']')

					table._editCell nextColumn

		input.on 'blur', =>
			input.replaceWith $('<span></span>').text input.val()