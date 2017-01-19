 function localize(crmHref, localHostName, portNumber) {
     crmHref = crmHref.replace("view-source:", "");
     //  temp = temp.replace("https://appdev.clickdimensions.com", "http://localhost:" + portNumber);
     //  temp = temp.replace("https://mscrmappdev.clickdimensions.com", "http://localhost:" + portNumber);

     var clickdimensionsDomain = 'clickdimensions.com';
     var index = crmHref.indexOf(clickdimensionsDomain)
     if (index > -1) {
         index += clickdimensionsDomain.length;
         var domain = crmHref.substring(0, index)
         crmHref = crmHref.replace(domain, localHostName + ":" + portNumber)
     }
     
     return crmHref.trim();
 }

 function getQueryStringDictionary(tabUrl) {
     var dictionary = {};
     try {
         var params = tabUrl.split('?')[1].split('&');

         for (var index = 0; index < params.length; index++) {
             var innerParts = params[index].split('=');
             dictionary[innerParts[0]] = innerParts[1];
         }
     } catch (ex) {
         console.log(ex);
     }

     return dictionary;
 }

 function goToLocal(tabUrl) {
     var portNumber = document.getElementById('PortNum').value;
     var localHostName = document.getElementById('localHost').value;
     var localUrl = localize(tabUrl, localHostName, portNumber);
     var qsInputs = $('.qs-info');

     var localDomain = localUrl.split('?')[0] + "?";
     var arr = [];
     qsInputs.each(function (index, input) {
         arr.push(input.getAttribute('data-key') + "=" + input.value);
     });

     localDomain = localDomain + arr.join('&');
     chrome.tabs.create({
         "url": localDomain
     });
 }

 document.addEventListener('DOMContentLoaded', function () {
     var tabUrl = '';
     $('#divOpener').click(function () {
         var btn = $(this);
         if (btn.attr('data-isopen') === "0") {
             //is closed
             $("#hostData").slideDown(300);
             btn.attr('data-isopen', '1').html('Close');
         } else {
             $("#hostData").slideUp(300);
             btn.attr('data-isopen', '0').html('Open');
         }
     });

     chrome.tabs.query({
         active: true,
         currentWindow: true
     }, function (tabs) {
         tabUrl = tabs[0].url;

         var qsDictionary = getQueryStringDictionary(tabUrl);
         var dataDiv = $('#qsData');

         for (var key in qsDictionary) {
             if (qsDictionary.hasOwnProperty(key)) {
                 var innerDiv = $('<div class="innerDiv"></div>');
                 innerDiv.append('<label class="label label-primary bigger-label">' + key + ' </label>');
                 innerDiv.append('<input class="form-control qs-info" type="text" data-key="' + key + '" title="' + qsDictionary[key] + '" value="' + qsDictionary[key] + '">');

                 dataDiv.append(innerDiv);
             }
         }
         document.getElementById('goTo').addEventListener('click', function () {
             goToLocal(tabUrl)
         });

         document.getElementById('container').addEventListener('keyup', function (event) {
             if (event.keyCode === 13) {
                 goToLocal(tabUrl)
             }
         });



     })

 });