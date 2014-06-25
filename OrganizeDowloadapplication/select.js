
var scan_results;
var scan_resultsindex = 0;
var scan_gallData = [];
var scan_reader = null;
var scan_directories = [];
var dire_entry;

function errorPrintFactory(err) {
	console.log(err);
}
function filecollection(entry) {
	this.direntry = entry;
	this.dirFiles = [];
	this.dirFilesmetaData = [];
	this.dirFileindex = 0;
}

function dircollection() {
	this.directories = [];
	this.directoriesindex = 0;
	
}

function GalleryData(id) {
	this._id = id;
	this.path = "";
	this.sizeBytes = 0;
	this.numFiles = 0;
	this.numDirs = 0;
	this.gallDirectories = new dircollection();
}

function scanGallery(entries){
	if (entries.length ==0) {
		if (scan_directories >0) {
			dire_entry = scan_directories.shift();
			scan_reader = dire_entry.createReader();
			scan_reader.readEntries(scanGallery,errorPrintFactory('scanning sub directory'));
		}
		else {
			scan_resultsindex =  scan_resultsindex+1;
			if (scan_resultsindex < scan_results.length) {		
				scanGalleries(scan_results[scan_resultsindex]);
			}	
		}
		return;
	}
	var directoryrepo;
	for (var i=0;i< entries.length;i++) {
		for (var j =0;j<scan_results.length;j++){
			if (scan_results[j] == entries[0].filesystem) {
				directoryrepo = scan_gallData[j];
			}
		}
		if (entries[i].isFile) {
			var directorybank = directoryrepo.gallDirectories;
			var directoriesindex;
			var directory = directorybank.directories;
			for (var k=0;k<directory.length;k++){
				if (directory[k].direntry == entries[0].filesystem) {
					directoriesindex = k;
				}
				else if (directory[k].direntry == dire_entry) {
					directoriesindex = k;					
				}
				
			}
			var currentdirectory = directory[directoriesindex];
	


			currentdirectory.dirFiles[currentdirectory.dirFiles.length] =  entries[i];
			currentdirectory.dirFileindex++;
			directoryrepo.numFiles++;

			var metadata = currentdirectory;
			var fileindex = currentdirectory.dirFileindex;

			entries[i].getMetadata(function(metadata_) {
				metadata.dirFilesmetaData[fileindex]= metadata_;
			});			
		}
		else if(entries[i].isDirectory) {
			var directorybank = directoryrepo.gallDirectories;

			scan_directories.push(entries[i]);
			directoryrepo.numDirs++;
			console.log(directorybank.directoriesindex);
			directorybank.directoriesindex++;
			console.log(directorybank.directoriesindex);
			console.log("directories"+ entries[i]+directorybank.directories.length);
			directorybank.directories[directorybank.directories.length] = new filecollection(entries[i]);
		}
	}
	scan_reader.readEntries(scanGallery,errorPrintFactory('read more Entries'));
}

function scanGalleries (fs) {
	var gallData = chrome.mediaGalleries.getMediaFileSystemMetadata(fs);
	scan_gallData[scan_resultsindex] = new GalleryData(gallData.galleryId);
	scan_gallData[scan_resultsindex].path = gallData.name;
	var directories = scan_gallData[scan_resultsindex].gallDirectories.directories;
	var directoriesindex = scan_gallData[scan_resultsindex].gallDirectories.directoriesindex;


	directories[directoriesindex] = new filecollection(fs);
	scan_reader = fs.root.createReader();
	scan_reader.readEntries(scanGallery,errorPrintFactory('readEntries'));
}

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

	scanGalleries(scan_results[0]);
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
