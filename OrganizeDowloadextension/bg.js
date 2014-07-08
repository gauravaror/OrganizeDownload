// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Force all downloads to overwrite any existing files instead of inserting
// ' (1)', ' (2)', etc.
var sd;
var filename;
var orignal;
var orignalfilename;
chrome.downloads.onDeterminingFilename.addListener(function(item, suggest) {
  sd = suggest;
  orignal = item;
  orignalfilename = item.filename;
  chrome.runtime.sendMessage("cmlahlbolmcipooecdjpcflcefmljopa",[ "downloaddeterminingfilename",item],function(response) {
      console.log(response);
      suggest();  
});
return true;
  // conflict_action was renamed to conflictAction in
  // http://src.chromium.org/viewvc/chrome?view=rev&revision=214133
  // which was first picked up in branch 1580.
});

chrome.runtime.onMessageExternal.addListener( function(message,sender,sendResponse) {
console.log(message.filename+"  sdfds");
filename = message.filename;
sd({filename: message.filename,
           conflict_action: 'overwrite',
           conflictAction: 'overwrite'});
});

chrome.downloads.onChanged.addListener(function (downloadDelta) {
        console.log(downloadDelta);
        if (downloadDelta && downloadDelta.state && downloadDelta.state.current == 'complete') {
           chrome.runtime.sendMessage("cmlahlbolmcipooecdjpcflcefmljopa",[ "moveFile" , orignalfilename,filename],function (response) {
                console.log(response);
            });
        } else if (downloadDelta && downloadDelta.filename) {
            orignalfilename = downloadDelta.filename.current;
        }
    });
