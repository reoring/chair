class SequenceMoveMode
	move: (input, column, table) ->
		input.on 'keypress', (event) =>
            if event.which == 13
                input.replaceWith $('<span></span>').text input.val()

                if column.next().length == 0
                    table._editCell $(column.parent().next().find('td')[0])
                else
                    table._editCell column.next()

        input.on 'blur', =>
            input.replaceWith $('<span></span>').text input.val()