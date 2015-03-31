/*!
 * webkitecture-text.js
 * http://coronadofactory.com/webkitecture/
 *
 * Copyright (c) 2011-2015 Jose Antonio Garcia
 * Released under the MIT license
 * https://raw.github.com/coronadoland/webkitecture/master/LICENSE.txt
 *
 * Date: 2014-12-25
 */

define({
    load: function (name, req, onload, config) {
    	var php = config.factory.text;
    	var url = php + '?' + 'component=' + name;
	    $.ajax({url: url}).then(function(data) {onload(data);});
	}
});