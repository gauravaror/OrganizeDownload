
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
    showFilters();
}

function deleteRule(currentfilers,r) {
    console.log("Delete rule called"+ r);
}

function showFilters() {
    var showRules =  document.getElementById("showrules");
    while(showRules.firstChild) {
        showRules.removeChild(showRules.firstChild);
    }
    chrome.storage.sync.get({
    filters: []
    }, function(item) {
        var currentfilters = item.filters;
        showRules.textContent = "Total available filters: "+ currentfilters.length;
        for (var r=0;r < currentfilters.length; r++ ) {
            var upperdiv = document.createElement("div");
            upperdiv.id = "rule"+r;
            if (r%2 == 0) {
                upperdiv.className = "evenclassrule";
            } else {
                upperdiv.className = "oddclassrule";
            }
            for (key in currentfilters[r]) {
                if (currentfilters[r][key] != ""){
                    var keydiv = document.createElement("div");
                    var keylabel  = document.createElement("label");
                    var textlabel = document.createTextNode(key+" : "+currentfilters[r][key]);
                    keylabel.appendChild(textlabel);
                    keydiv.appendChild(keylabel);
                    upperdiv.appendChild(keydiv);
                }
            }
            var button  = document.createElement("button");
            button.innerText = "Delete";
            button.addEventListener("click",function (val) { return function() { deleteRule(currentfilters,val) }}(r));
            upperdiv.appendChild(button);
            showRules.appendChild(upperdiv);        
        }
    
    });    
}
function startup_init(){
    var butt = document.getElementById("addfilters");
    butt.addEventListener("click",addfilters);
    populate_targetdir();
    showFilters();
}

document.addEventListener("DOMContentLoaded",startup_init);
