# Connector js

## Sintaxis

		new WebK.Query({
			service: service, posturl: posturl,
			request: request, datatype: datatype,
			callback: parms.callback,
			panel:panel,
			action:action
		});
		
## Parameters to invoke

* `service` The service to invoke
* `post url`
* `request` The request to send the service using ajax architecture
* `datatype` The datatype to build ContentType String. Default json.
    application/`datatype`;charset=utf8
* `callback` The function to call when response is ok


