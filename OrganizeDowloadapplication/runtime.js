
var scan_progress;
var scan_results;
var scan_gallData = [];
var scan_directories = [];
var scan_reader = null;
var directory_data = {}
var file_data = {}
var currentreader=null;
var currentworkingfile;
var index=0;
var lengthfs;
var scanningdone = false;
var imgFormats = ['png', 'bmp', 'jpeg', 'jpg', 'gif', 'png', 'svg', 'xbm', 'webp'];
var audFormats = ['wav', 'mp3'];
var vidFormats = ['3gp', '3gpp', 'avi', 'flv', 'mov', 'mpeg', 'mpeg4', 'mp4', 'ogg', 'webm', 'wmv'];
var downloadLocation = {};


function scanDir(entries) {
    for (var i =0 ;i< entries.length;i++) {
        console.log(entries[i]);
    }
}

function isSupportedFile(item) {
    var filename = item.filename;
    var ext = filename.substr(filename.lastIndexOf('.') + 1).toLowerCase();
    if (imgFormats.indexOf(ext) >= 0)
      return true;
    else if (audFormats.indexOf(ext) >= 0)
      return true;
    else if (vidFormats.indexOf(ext) >= 0)
      return true;
    else return false;

}

function scoreRule(rule,downloadobj) {
    var score = 0;
    for (key in rule) {
        if (rule[key] != "" && downloadobj[key] && downloadobj[key] != "") {
            if ((new RegExp(rule[key])).test(downloadobj[key])) {
                score++;
            }
        }
    }
   return score; 
}

//Used to sort the array of scores.
function compare(a,b) {
    if (a[1] == b[1] ) {
        return 0;
    } else if (a[1] > b[1]) {
        return  -1;
    } else {
        return 1;
    }
}

function rulesApply(downloadObj,sendResponse) {
    var returnvalue = false;
    var rulescores = [];
    chrome.storage.sync.get({
        filters: []
    },function(item) {
        var currentfilters = item.filters;
        for (var r=0;r<currentfilters.length;r++) {
            rulescores.push([currentfilters[r],scoreRule(currentfilters[r],downloadObj)]);
        }        
        rulescores.sort(compare);
        console.log(rulescores);
        if (rulescores && rulescores[0] && rulescores[0][1] && rulescores[0][1] > 0) {
            returnvalue  = true;
            downloadLocation[downloadObj["id"]] = rulescores[0][0]["targetdirectories"];
            sendResponse("ok");
        } else {
            if (scanningdone) {
            	chrome.app.window.create('selectName.html', 
                		{bounds: {width:1300, height:700}, minWidth:900, maxWidth: 1300, minHeight:600, maxHeight: 700, transparentBackground:true ,id:"MGExp"+downloadObj.id}, 
	                	function(app_win) {
    		            	app_win.contentWindow.send = sendResponse;
    		        	    app_win.contentWindow.downloadObject = downloadObj;
        	        	}
        	        );
            	    console.log("app launched"+downloadObj);
        
            }
        }
    }); 
}

chrome.runtime.onMessageExternal.addListener( function(message,sender,sendResponse) {
if (message[0] == "downloaddeterminingfilename") {
    console.log(message[1]);
    currentworkingfile = message[1];	
    if (isSupportedFile(message[1])) {
        rulesApply(message[1],sendResponse);
        return true;
    } else {
        sendResponse("notok");
        console.log("extension not supported")
    }
}
else if (message[0] == "moveFile") {
    console.log("location : " + message[1] + " moe "+message[2]+ " download id : "+message[3]);
    if (message[3] != null) {
        message[2] = downloadLocation[message[3]];
    }
    var filename = message[1].split("/");
    var fn = filename[filename.length-1];
    filename.splice(filename.length-1,1);
    var name = filename.join("/");
    console.log(name);
    var direntry1 = directory_data[name];
    console.log(direntry1);
    if (message[2] !== null) {
        var filename2 = message[2].split("/");
//        filename2.splice(filename2.length-1,1);
        var name2 = filename2.join("/");
        console.log(name2);
        var direntry2 = directory_data[name2];
        console.log(direntry2);
        if ( direntry1 && direntry2) {
        var reader = direntry1.createReader();
        reader.readEntries(function(entries){ 
            for (var o=0;o<entries.length;o++) {
                if (entries[o].name == fn) {
                        var ferror = function() {console.log("error "+ fn)};
                        var fsuccess = function() {console.log("success "+ fn)};
                        entries[o].copyTo(direntry2,fn,function (val) { return function() { val.remove(fsuccess,ferror);console.log("success"+val.name) } }(entries[o]),ferror);
                    }
                }
                });
            sendResponse("ok");
        } else {
            sendResponse("file not available");
        }
        }
        else {
            sendResponse("error selected null");
        }
    }
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
    if (entries.length == 0) {
        if (scan_directories.length >0) {
            var dir = scan_directories.shift();
            currentreader = dir.createReader();
            currentreader.readEntries( scanfs, function(r) {console.log(r)});
                
        } else {
            index++;
            if (index<lengthfs) {
                 getDirectoryEntry(); 
            } else {
                console.log("done scanning");
                scanningdone = true;
                return;
            }
        }
        return;
    }
    for (var i =0;i<entries.length;i++) {
        if (entries[i].isDirectory) {
            var cmeta = chrome.mediaGalleries.getMediaFileSystemMetadata(entries[i].filesystem);
            directory_data[cmeta.name+entries[i].fullPath] = entries[i];
            scan_directories.push(entries[i]);
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
    if (message.filename) {
    	console.log("fgf"+message.filename);
	    chrome.runtime.sendMessage("pmbapjgcgcnocmllkbcehgljickgjiif",{"filename" : String(message.filename) },function(response) { 
		    console.log(response);
    	});
	    senderResonsefff("ok");
    } else if (message.settings) {
        console.log(message.settings);
        if (scanningdone) {
            chrome.app.window.create('settingorganize.html', 
	    	{bounds: {width:900, height:700}, minWidth:900, maxWidth: 900, minHeight:600, maxHeight: 600, id:"SettingFilter"+message.settings.id}, 
                        function(app_win) {
    		            	app_win.contentWindow.referenceFilterObject = message.settings;
                         });
            senderResonsefff("ok");
        
     }
    }
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

chrome.app.runtime.onLaunched.addListener(function() {
    if( scanningdone) {
      chrome.app.window.create('settingorganize.html', {
        'bounds': {
          'width': 900,
          'height': 700
        }
      });
    }
});
