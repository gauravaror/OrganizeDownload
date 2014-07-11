
window.onload = function(){
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

