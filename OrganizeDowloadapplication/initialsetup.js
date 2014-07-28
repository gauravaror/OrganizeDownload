
var directoriestest = false;
var downloaddirtest = false;

function getGalleriesInfo(){
    chrome.runtime.getBackgroundPage(function (bgp) {
        bgp.index = 0;
        bgp.getDirectoryEntry(); 
        setTimeout(populateStatus,6000);
    });
}
function add_scan_results() {
    chrome.mediaGalleries.addScanResults(getGalleriesInfo);
}
function closewindow() {
    window.close();
}

function populateStatus() {
    chrome.runtime.getBackgroundPage(function (bgp) {
        var dirdata = bgp.directory_data;
        var downloadstagestatusdiv = document.getElementById("downloadfolderstagestatus");
        if(dirdata[downloadDirectory] !== undefined) {
            downloaddirtest = true;
            downloadstagestatusdiv.textContent = "Passed";
            downloadstagestatusdiv.style.color = "green";
        } else {
            downloadstagestatusdiv.textContent = "Not Passed";
            downloadstagestatusdiv.style.color = "red";
        }

        var permissionstagestatusdiv = document.getElementById("permissionstagestatus");
        if(Object.keys(dirdata).length > 8 ) {
            directoriestest = true;
            permissionstagestatusdiv.textContent = "Passed";
            permissionstagestatusdiv.style.color = "green";
        } else {
            permissionstagestatusdiv.textContent = "Not Passed";
            permissionstagestatusdiv.style.color = "red";
        }
        if( directoriestest && downloaddirtest ) {
            var infodiv = document.getElementById('info');
            infodiv.textContent = "Well done,All requirements are complete. This window will close in a while";
            infodiv.style.color = "green";
            setTimeout(closewindow,10000);
        }

    });
}

function checkTests(){
    var infodiv = document.getElementById('info');
    if( directoriestest && downloaddirtest) {
        infodiv.textContent = "Well done,All requirements are complete. This window will close in a while";
            infodiv.style.color = "green";
        setTimeout(closewindow,10000);
    } else {
        infodiv.textContent = "All requirements are still not complete, please review results.";
        infodiv.style.color = "red";
        populateStatus();
    }
}

function changeFolder() {
    downloadDirectory = document.getElementById("downloadstagefolder").value;
    populateStatus();
}

function populateStage() {
    
    document.getElementById('add').addEventListener('click',add_scan_results);
    document.getElementById('checkstagebutton').addEventListener('click',checkTests);
    document.getElementById('change-folder-button').addEventListener("click", changeFolder);
    document.getElementById('downloadstagefolder').value = downloadDirectory;
    document.getElementById('add-folder-button').addEventListener("click", function() {
      chrome.mediaGalleries.addUserSelectedFolder(getGalleriesInfo);
    });


}


document.addEventListener('DOMContentLoaded',populateStage);

