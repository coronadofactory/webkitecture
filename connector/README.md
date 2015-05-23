# Query.js

## Sintaxis

		new WebK.Query({
			service: service, posturl: posturl,
			request: request, datatype: datatype,
			callback: parms.callback,
			panel:panel
		});
		
## Parameters to invoke

* `service` The service to invoke. This is an objet with two properties (`url` and `method`)
* `posturl`
* `request` The request to send the service using ajax architecture
* `datatype` The datatype to build ContentType String. Default json.
    application/`datatype`;charset=utf8
* `callback` The function to call when response is ok

# Form.js

## Sintaxis

		new WebK.Form({
			service: service, posturl: posturl,
			callback: parms.callback,
			panel:panel,
			action:action
		});
		
## Parameters to invoke

* `service` The service to invoke. This is an objet with two properties (`url` and `method`)
* `posturl`
* `datatype` The datatype to build ContentType String. Default json.
    application/`datatype`;charset=utf8
* `callback` The function to call when response is ok
* `action` The object to trigger the invocation. It must be contain 'on' event with submit parameter


