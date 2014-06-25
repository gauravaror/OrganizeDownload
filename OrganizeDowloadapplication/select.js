
var scan_results;
var scan_resultsindex = 0;

function getGalleriesInfo  (results) {
	console.log(" getGalleriesInfo function   l"+results.length);
	scan_results = results;
   	if (results.length) {
	      var str = 'Gallery count: ' + results.length + ' ( ';
	      results.forEach(function(item, indx, arr) {
        	 var mData = chrome.mediaGalleries.getMediaFileSystemMetadata(item);

	         if (mData) {
        	    str += mData.name;
	            if (indx < arr.length-1)
        	       str += ",";
	            str += " ";
        	 }
	      });
	      str += ')';
	console.log(str);      
	document.getElementById('addtext').textContent = 'Gallery count: ' + results.length;
      	scan_results = results; // store the list of gallery directories
        scan_resultsindex = 0;

   	}
	document.getElementById('add').remove();

//	scanGalleries();
}

function save_options() {
chrome.runtime.sendMessage({"filename": String(document.getElementById('namefield').value)},function(response) {
window.close();
});

}

function restore_options() {
document.getElementById('namefield').value = "./" ;
document.getElementById('save').addEventListener('click',
    save_options);
if (scan_results == undefined) {
	document.getElementById('add').addEventListener('click',
	    add_scan_results);
	document.getElementById('addtext').textContent = "Please click on add to give permission and required gallaries!! This is one time step";
} else {
	document.getElementById('add').remove();
}


}

function add_scan_results() {
	chrome.mediaGalleries.addScanResults(getGalleriesInfo);
}

document.addEventListener('DOMContentLoaded', restore_options);
