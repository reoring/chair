class AjaxDataSource
    constructor: (@url) ->

    retrieve: (callback, parameter) ->
       	$.get @url, parameter, (response) ->
       		callback response