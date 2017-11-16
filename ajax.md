# Call ajax from javascript
    
    $.ajax({
      url: '/myurl', method: 'POST', contentType: 'text/html;charset=utf8'
      }).then(function (data) {
          // Doing someting with data
    }).fail(function(XMLHttp, textStatus, errorThrown) {
          if (window.console) {
              console.error(textStatus);
            console.error(XMLHttp);
          }
     });
     
     
# JSON Connector

    // Loaders on
    
    $.ajax({
        url: '/myurl', type: 'POST', contentType:'application/json;charset=utf8', dataType: 'json', 
        data:JSON.stringify(request)
    }).then(function (data) {
        // data is a Javascript object
    }).always(function () {
        // Loaders off
    }).fail(function(XMLHttp, textStatus, errorThrown) {
        if (window.console) {
            console.error(textStatus);
            console.error(XMLHttp);
        }
    })
