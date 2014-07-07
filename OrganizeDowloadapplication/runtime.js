
var scan_progress;
var scan_results;
var scan_gallData = [];
var scan_reader = null;
var directory_data = {}
var file_data = {}
var currentreader=null;
var index=0;
var lengthfs;
var scanningdone = false;


function scanDir(entries) {
    for (var i =0 ;i< entries.length;i++) {
        console.log(entries[i]);
    }
}

chrome.runtime.onMessageExternal.addListener( function(message,sender,sendResponse) {
if (message[0] == "downloaddeterminingfilename") {
	
	chrome.app.window.create('selectName.html', 
    		{bounds: {width:900, height:600}, minWidth:900, maxWidth: 900, minHeight:600, maxHeight: 600, id:"MGExp"}, 
	    	function(app_win) {
    			app_win.contentWindow.send = sendResponse;
	    	}
	    );
	    console.log("app launched"+message);
}
else if (message[0] == "moveFile") {
    console.log("location : " + message[1] + " moe "+message[2]);
    var filename = message[1].split("/");
    var fn = filename[filename.length-1];
    filename.splice(filename.length-1,1);
    var name = filename.join("/");
    console.log(name);
    var direntry1 = directory_data[name];
    console.log(direntry1);
    var filename2 = message[2].split("/");
    filename2.splice(filename2.length-1,1);
    var name2 = filename2.join("/");
    console.log(name2);
    var direntry2 = directory_data[name2];
    console.log(direntry2);
    var reader = direntry1.createReader();
    reader.readEntries(function(entries){ 
        for (var o=0;o<entries.length;o++) {
            if (entries[o].name == fn) {
                var ferror = function() {console.log("error "+ fn)};
                var fsuccess = function() {console.log("success "+ fn)};
                entries[o].copyTo(direntry2,fn,fsuccess,ferror);
                }
            }
            });
        }
    sendResponse("ok");
});




function  getDirectoryEntry() {
chrome.mediaGalleries.getMediaFileSystems(function(filesystem) {
    if (index < filesystem.length) {
        lengthfs = filesystem.length;
        var currentfs = filesystem[index];
        var currentmetadata = chrome.mediaGalleries.getMediaFileSystemMetadata(currentfs);
        directory_data[currentmetadata.name] = currentfs.root;
        currentreader =  currentfs.root.createReader();
        currentreader.readEntries( scanfs, function(r) {console.log(r)});
    }
});
}

function scanfs(entries) {
    console.log(entries);   
    if (entries.length == 0) {
        index++;
        if (index<lengthfs) {
         getDirectoryEntry(); 
        }else {
            console.log("done scanning");
            scanningdone = true;
            return;
        }
        return;
    }
    for (var i =0;i<entries.length;i++) {
        if (entries[i].isDirectory) {
            var cmeta = chrome.mediaGalleries.getMediaFileSystemMetadata(entries[i].filesystem);
            directory_data[cmeta.name+entries[i].fullPath] = entries[i];
        }
        else if(entries[i].isFile) {
            var cmeta = chrome.mediaGalleries.getMediaFileSystemMetadata(entries[i].filesystem);
            file_data[cmeta.name+entries[i].fullPath] = entries[i];
            
        }
    }
    currentreader.readEntries(scanfs,function(r) {console.log(r)});
}

getDirectoryEntry();

chrome.runtime.onMessage.addListener(function(message,sender,senderResonsefff) {
	console.log("fgf"+message.filename);
	chrome.runtime.sendMessage("ldhjlkdleiclkdbfneaknlbnploleocg",{"filename" : String(message.filename) },function(response) { 
		console.log(response);
	});
	senderResonsefff("ok");
});



var scan_mediagallaries = function () {
	chrome.mediaGalleries.startMediaScan();
}



chrome.mediaGalleries.onScanProgress.addListener(function (details) {
	scan_progress = details;
	if (details.type == 'finish') {
		console.log("finished scan");
	}
	console.log(" scan function");
});


scan_mediagallaries();
