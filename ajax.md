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