
 function populate_targetdir (){
    var select = document.getElementById("targetdirlist");
    chrome.runtime.getBackgroundPage(function (bgp) {
        var data = bgp.directory_data;
        for ( keys in data) {
            var el = document.createElement("option");
            el.textContent = keys;
            el.value = keys;
            select.appendChild(el);
        }
    });
}

function addfilters() {
    //Getting the values from the form of add filter.
    var url = document.getElementById("urlfield");
    var referrer = document.getElementById("referrerfield");
    var mime = document.getElementById("mimefield");
    var filename = document.getElementById("filenamefield");
    var targetdirectorieselem = document.getElementById("targetdirlist");
    var targetdirectories = targetdirectorieselem.options[targetdirectorieselem.selectedIndex].value;
    if (url.value == "" && referrer.value == "" && mime.value == "" && filename.value == "") {
        var error = document.getElementById("info");
        error.textContent = "Please fill atleast one of field url,referrer,mime,filename for valid rule:";
        error.style.color = "Red";
        error.style.fontSize = "medium";
        setTimeout(function(){error.textContent = 'Add Filters:' ; error.style.color = "Black";},1000)
    } else {
    //Creating the filter object.
        var filterobject= {url: url.value, referrer:referrer.value,mime:mime.value,filename:filename.value,targetdirectories:targetdirectories}
        console.log(filterobject);
        chrome.storage.sync.get({
            filters: [],
          },function(item) {
            var currentfilters = item.filters;
            currentfilters.push(filterobject);
            chrome.storage.sync.set({
                filters: currentfilters    
            },function(){
                var success = document.getElementById("info");
                success.textContent = "Filter Successfully added:";
                success.style.color = "Green";
                success.style.fontSize = "medium";
                url.value = "";
                referrer.value = "";
                mime.value = "";
                filename.value = "";
                targetdirectorieselem.selectedIndex = 0;
                setTimeout(function(){success.textContent = 'Add Filters:' ; success.style.color = "Black";},1000)
            });
          });


    }
}
function startup_init(){
    var butt = document.getElementById("addfilters");
    butt.addEventListener("click",addfilters);
    populate_targetdir();
}

document.addEventListener("DOMContentLoaded",startup_init);
