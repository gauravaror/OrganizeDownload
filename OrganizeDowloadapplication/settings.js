
function populate_usingReferenceFilters(rule){
    //Getting the reference values from the reference object which came  from the packet.
    var referenceurl = referenceFilterObject.url;
    var referencetitle = referenceFilterObject.title;
    var referencereferrer  = referenceFilterObject.referrer;
    var referencemime = referenceFilterObject.mime;
    var referencetargetdirectories = referenceFilterObject.targetdirectories;

    // Getting the objects on add filter page to populate values;
    var url = document.getElementById("urlfield");
    var title = document.getElementById("titlefield");
    var referrer = document.getElementById("referrerfield");
    var mime = document.getElementById("mimefield");
    var targetdirectorieselem = document.getElementById("targetdirlist");
    var a = document.createElement('a');
    if (referenceurl != "") {
        a.href = referenceurl;
        url.value =  a.hostname
    }
    if (referencereferrer !=  "") {
        a.href = referencereferrer;
        referrer.value = a.hostname;
    }

    if (rule) {
        url.value = referenceurl;   
        referrer.value = referencereferrer;
    }

    if( referencetitle &&  referencetitle  != "") {
        title.value =  referencetitle;
    }
    
    if (referencemime != "") {
        mime.value = referencemime;
    }
    
    if ( referencetargetdirectories != "") {
        for (var i=0;i < targetdirectorieselem.options.length;i++){
            if (targetdirectorieselem.options[i].value == referencetargetdirectories) {
               targetdirectorieselem.selectedIndex = i; 
            }
        }    
    }
}

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
        //We are populating other values here since all target directries population is complete here.
        if (referenceFilterObject) {
            populate_usingReferenceFilters();
        }
    });
}

function addfilters() {
    //Getting the values from the form of add filter.
    var title = document.getElementById("titlefield");
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
        var filterobject= { title: title.value , url: url.value, referrer:referrer.value,mime:mime.value,filename:filename.value,targetdirectories:targetdirectories,enabled:true }
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
                title.value = "";
                targetdirectorieselem.selectedIndex = 0;
                setTimeout(function(){success.textContent = 'Add Filters:' ; success.style.color = "Black";},1000);
                showFilters();
            });
          });
    }
}

function deleteRule(currentfilters,r) {
    console.log("Delete rule called"+ r);
    currentfilters.splice(r,1);
    chrome.storage.sync.set({
        filters: currentfilters    
    },function(){
        var success = document.getElementById("info");
        success.textContent = "Filter Successfully deleted:";
        success.style.color = "Green";
        success.style.fontSize = "medium";
        setTimeout(function(){success.textContent = 'Add Filters:' ; success.style.color = "Black";},1000);
        showFilters();
    });
    
    
}

function editRule(currentfilters,r) {
    (function() {
        this.referenceFilterObject = currentfilters[r];
        populate_usingReferenceFilters(true);
    })();
    deleteRule(currentfilters,r);
}

function toggleEnable(currentfilters,r) {
    console.log("Toggle rule called"+ r);
    currentfilters[r]["enabled"] = !currentfilters[r]["enabled"];
    chrome.storage.sync.set({
        filters: currentfilters    
    },function(){
        var success = document.getElementById("info");
        success.textContent = "Filter Successfully changed:";
        success.style.color = "Green";
        success.style.fontSize = "medium";
        setTimeout(function(){success.textContent = 'Add Filters:' ; success.style.color = "Black";},1000);
        showFilters();
    });

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
                if (currentfilters[r][key] != "" && key != "enabled"){
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
            button.className     =   "btn btn-default btn-sm";
            button.addEventListener("click",function (val) { return function() { deleteRule(currentfilters,val) }}(r));
            var disablebutton  = document.createElement("button");
            disablebutton.className     =   "btn btn-default btn-sm";
            if(currentfilters[r]["enabled"]) {
                disablebutton.innerText = "Disable";
            } else {
                disablebutton.innerText = "Enable";
            }
            disablebutton.addEventListener("click",function (val) { return function() { toggleEnable(currentfilters,val) }}(r));
            var editbutton  = document.createElement("button");
            editbutton.innerText = "Edit";
            editbutton.className     =   "btn btn-default btn-sm";
            editbutton.addEventListener("click",function (val) { return function() { editRule(currentfilters,val) }}(r));
            upperdiv.appendChild(button);
            upperdiv.appendChild(disablebutton);
            upperdiv.appendChild(editbutton);
            showRules.appendChild(upperdiv);        
        }
    
    });    
}
function startup_init(){
    var butt = document.getElementById("addfilters");
    butt.addEventListener("click",addfilters);
    var buttclose = document.getElementById("closefilters");
    buttclose.addEventListener("click",function() {  window.close();});
    populate_targetdir();
    showFilters();
}

document.addEventListener("DOMContentLoaded",startup_init);
