
var scan_progress;
var scan_results;
var scan_gallData = [];

chrome.runtime.onMessageExternal.addListener( function(message,sender,sendResponse) {
if (message == "downloaddeterminingfilename") {
	
	chrome.app.window.create('selectName.html', 
    		{bounds: {width:900, height:600}, minWidth:900, maxWidth: 900, minHeight:600, maxHeight: 600, id:"MGExp"}, 
	    	function(app_win) {
    			app_win.contentWindow.send = sendResponse;
	    	}
	    );
	    console.log("app launched"+message);
}

});


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
