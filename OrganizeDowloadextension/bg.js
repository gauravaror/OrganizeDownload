// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Force all downloads to overwrite any existing files instead of inserting
// ' (1)', ' (2)', etc.
var sd;
var filename;
var orignal;
var orignalfilename;

var globalseprator="/";
var OSName="Unknown OS";
if (navigator.appVersion.indexOf("Win")!=-1) globalseprator="\\";
if (navigator.appVersion.indexOf("Mac")!=-1) globalseprator="/";
if (navigator.appVersion.indexOf("X11")!=-1) globalseprator="/";
if (navigator.appVersion.indexOf("Linux")!=-1) globalseprator="/";

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

function getDownloadLocation(sendResponse) {
    chrome.downloads.search({},function(downloaditems) {
        var arrayfilename = {};
        for (var i=0;i< downloaditems.length;i++) {
            var name =  downloaditems[i].filename.split(globalseprator);
            name.splice(name.length-1,1);
            var folder = name.join(globalseprator);
            if( arrayfilename[folder]) {
                arrayfilename[folder]++;
            } else {
                arrayfilename[folder] = 1;
            }
        }
        var sortablearray = []
        for ( var key in arrayfilename) {
            sortablearray.push([key,arrayfilename[key]]);
        }
        sortablearray.sort(compare);
        sendResponse(sortablearray[0][0]);
    });
}
chrome.downloads.onDeterminingFilename.addListener(function(item, suggest) {
  sd = suggest;
  orignal = item;
  orignalfilename = item.filename;
  chrome.runtime.sendMessage("ibnikgmjkdnijcigicjpnipibcieobdh",[ "downloaddeterminingfilename",item],function(response) {
      console.log(response);
      suggest({ overwrite:true, conflict_action: "overwrite" , conflictAction: "overwrite"});
});
return true;
  // conflict_action was renamed to conflictAction in
  // http://src.chromium.org/viewvc/chrome?view=rev&revision=214133
  // which was first picked up in branch 1580.
});

chrome.runtime.onMessageExternal.addListener( function(message,sender,sendResponse) {
    if(message.filename) {
        console.log(message.filename+"  sdfds");
        filename = message.filename;
        sd({overwrite:true, conflict_action: "overwrite" , conflictAction: "overwrite"});
    } else if( message.getDownloadlocation) {
       getDownloadLocation(sendResponse);
       return true;
    }
});

chrome.downloads.onChanged.addListener(function (downloadDelta) {
        console.log(downloadDelta);
        if (downloadDelta && downloadDelta.state && downloadDelta.state.current == 'complete') {
           chrome.runtime.sendMessage("ibnikgmjkdnijcigicjpnipibcieobdh",[ "moveFile" , orignalfilename,filename,downloadDelta.id],function (response) {
                console.log(response);
            });
        } else if (downloadDelta && downloadDelta.filename) {
            orignalfilename = downloadDelta.filename.current;
        }
    });
