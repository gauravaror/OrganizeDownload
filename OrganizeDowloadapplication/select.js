
var scan_results;
var scan_resultsindex = 0;
var scan_gallData = [];
var scan_reader = null;
var scan_directories = [];
var dire_entry;
var directories;
var xlinear;
var ylinear;
var defaultdrawtype = 2;

var imgFormats = ['png', 'bmp', 'jpeg', 'jpg', 'gif', 'png', 'svg', 'xbm', 'webp'];
var audFormats = ['wav', 'mp3'];
var vidFormats = ['3gp', '3gpp', 'avi', 'flv', 'mov', 'mpeg', 'mpeg4', 'mp4', 'ogg', 'webm', 'wmv'];

function check_option_available(targetdirectorieselem, stringname) {
    for (var i=0;i < targetdirectorieselem.options.length;i++){
        if (targetdirectorieselem.options[i].value == stringname) {
            return  true;
        }
    } 
    return false;
}
 
function populate_targetdir (){
    var select = document.getElementById("targetdirlist");
    chrome.runtime.getBackgroundPage(function (bgp) {
        var data = bgp.directory_data;
        for ( keys in data) {
            if(!check_option_available(select,keys)) {
                var el = document.createElement("option");
                el.textContent = keys;
                el.value = keys;
                select.appendChild(el);
            }
        }
    });
}

function getFileType(filename) {
   var ext = filename.substr(filename.lastIndexOf('.') + 1).toLowerCase();
   if (imgFormats.indexOf(ext) >= 0)
      return 0; // Returning 0 for image
   else if (audFormats.indexOf(ext) >= 0)
      return 1; //Returning 1 for image.
   else if (vidFormats.indexOf(ext) >= 0)
      return 2;//returning 2 for video.
   else return null;
}


function errorPrintFactory(custom,scanNextGallery) {
   return function(e) {
      var msg = '';

      switch (e.code) {
         case FileError.QUOTA_EXCEEDED_ERR:
            msg = 'QUOTA_EXCEEDED_ERR';
            break;
         case FileError.NOT_FOUND_ERR:
            msg = 'NOT_FOUND_ERR';
            break;
         case FileError.SECURITY_ERR:
            msg = 'SECURITY_ERR';
            break;
         case FileError.INVALID_MODIFICATION_ERR:
            msg = 'INVALID_MODIFICATION_ERR';
            break;
         case FileError.INVALID_STATE_ERR:
            msg = 'INVALID_STATE_ERR';
            break;
         default:
            msg = 'Unknown Error';
            break;
      };

      console.log(custom + ': ' + msg);
      console.log(e);
      if(scanNextGallery) {
            processNextGallery();
      } else {
            scanGallery([]);
     }
   };
}

function filecollection(entry) {
	this.direntry = entry;
	this.dirFiles = [];
	this.dirFilesmetaData = [];
	this.dirFileindex = 0;
    this.type = [0,0,0];
    this.fullPath;
    
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


function processNextGallery() {
    scan_resultsindex++;
    if (scan_resultsindex < scan_results.length) {		
        scanGalleries(scan_results[scan_resultsindex]);
    }
    else {
        console.log("scanning finished");
        chrome.runtime.getBackgroundPage(function (bg) {
            bg.scan_results = scan_results;
            bg.scan_gallData = scan_gallData;
        });
        chrome.runtime.getBackgroundPage(function(bgp) {
            var filetype = getFileType(bgp.currentworkingfile.filename)
            displayGallaries(filetype,bgp.currentworkingfile.filename,defaultdrawtype);
        });
    }	
}

function scanGallery(entries){
	if (entries.length ==0) {
		if (scan_directories.length >0) {
//			console.log("scan dir lengh : "+scan_directories.length);
			dire_entry = scan_directories.shift();
//			console.log("scan dir lengh : "+scan_directories.length);
			scan_reader = dire_entry.createReader();
			//console.log("Scanning sub directories : "+dire_entry.fullPath +" " + dire_entry.name);
			scan_reader.readEntries(scanGallery,errorPrintFactory('scanning sub directory'),false);
		}
		else {
            processNextGallery();
		}
		return;
	}
	var directoryrepo;
	for (var i=0;i< entries.length;i++) {
		for (var j =0;j<scan_results.length;j++){
			if (scan_results[j] == entries[i].filesystem) {
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
            var filetype = getFileType(entries[i].name);
            currentdirectory.type[filetype]++;
			currentdirectory.dirFileindex++;
			directoryrepo.numFiles++;
            var filelist;
                if (currentdirectory.direntry.hasOwnProperty("isFile")) {
	                var dirData = chrome.mediaGalleries.getMediaFileSystemMetadata(currentdirectory.direntry.filesystem);
            		filelist = dirData.name+currentdirectory.direntry.fullPath;
                } else {
	                var dirData = chrome.mediaGalleries.getMediaFileSystemMetadata(currentdirectory.direntry);
                    filelist = dirData.name;
                }
            currentdirectory.fullPath = filelist;        
    		var metadata = currentdirectory;
			var fileindex = currentdirectory.dirFileindex;

			entries[i].getMetadata(function(metadata_) {
				metadata.dirFilesmetaData[fileindex]= metadata_;
			});			
		}
		else if(entries[i].isDirectory) {
			var directorybank = directoryrepo.gallDirectories;
			//console.log("directory : "+entries[i].fullPath);
			if (entries[i].fullPath != "/") {
				scan_directories.push(entries[i]);
				directoryrepo.numDirs++;
				directorybank.directoriesindex++;
				directorybank.directories[directorybank.directories.length] = new filecollection(entries[i]);
			}
			else {
				console.log("skipping root due to recursion, some issue with file system");
			}
		}
	}
	scan_reader.readEntries(scanGallery,errorPrintFactory('read more Entries',false));
}

function scanGalleries (fs) {
	var gallData = chrome.mediaGalleries.getMediaFileSystemMetadata(fs);
	console.log("Scanning New gallery+ :"+gallData.name);
	scan_gallData[scan_resultsindex] = new GalleryData(gallData.galleryId);
	scan_gallData[scan_resultsindex].path = gallData.name;
	var directories = scan_gallData[scan_resultsindex].gallDirectories.directories;
	var directoriesindex = scan_gallData[scan_resultsindex].gallDirectories.directoriesindex;
	directories[directoriesindex] = new filecollection(fs);
    directories[directoriesindex].fullPath = gallData.name;
	scan_reader = fs.root.createReader();
	scan_reader.readEntries(scanGallery,errorPrintFactory('readEntries',true));
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
//	var add = document.getElementById('add')
    chrome.runtime.getBackgroundPage(function(bgp) {
        bgp.index=0;
        bgp.getDirectoryEntry();
        setTimeout(populate_targetdir,1000);
    });
    
  //  if (add) {
    //    add.remove();
   // }

	scanGalleries(scan_results[0]);
}

function store_user_data_for_ranking(referenceFilterObject,dirname) {
    var referenceurl = referenceFilterObject.url;
    var referencereferrer  = referenceFilterObject.referrer;
    var referencemime = referenceFilterObject.mime;
    var referencetargetdirectories = dirname;
    var url_,referrer_,mime_;
    var a = document.createElement('a');
    if (referenceurl != "") {
        a.href = referenceurl;
        url_ =  a.hostname
    }
    if (referencereferrer !=  "") {
        a.href = referencereferrer;
        referrer_ = a.hostname;
    }
   
    var user_selection = {url:url_ , referrer :referrer_ ,  mime:referencemime , targetdirectories: referencetargetdirectories} ;
    chrome.storage.sync.get({'old_user_selections' : {}},function(item) {
            if (item.old_user_selections[dirname]) {
                item.old_user_selections[dirname].push(user_selection);
            }else {
                item.old_user_selections[dirname] = [];
                item.old_user_selections[dirname].push(user_selection);        
            }
        
        chrome.storage.sync.set({ 'old_user_selections' : item.old_user_selections},function (item) {
            console.log("saved the user preference");
            console.log(item);
        });
    });
}

function save_options(addfilter) {

var targetdirectorieselem = document.getElementById("targetdirlist");
var name = targetdirectorieselem.options[targetdirectorieselem.selectedIndex].value;
store_user_data_for_ranking(downloadObject,name);
chrome.runtime.getBackgroundPage( function(bgp) {
    var download_id = downloadObject.id;
    bgp.downloadLocation[download_id] = name;
    chrome.runtime.sendMessage({"filename": String(name)},function(response) {
    if (addfilter) {
        downloadObject["targetdirectories"] = name;
        chrome.runtime.sendMessage({"settings": downloadObject },function(response) {
            window.close();
        });
    } else {
        window.close();
    }
    });
});
}


function changeLayout() {
    if(defaultdrawtype == 1) {
        defaultdrawtype = 2;
        displayClusterDendogramLayout();
    } else {
        defaultdrawtype = 1;
        displayForceLayout();
    }
    
}

function changeSelectOption() {
    var targetdirectorieselem = document.getElementById("targetdirlist");
    var name = targetdirectorieselem.options[targetdirectorieselem.selectedIndex].value;
    var dirs = name.split("/");
    var shortname_dir = dirs[dirs.length-1];
    document.getElementById("save").innerText = "Store at "+shortname_dir;    
    
}

function restore_options() {
document.getElementById('filename').textContent = "Please select the name and download location for your download: "+ downloadObject.filename;
document.getElementById('save').addEventListener('click',function () {
    save_options(false) } );
document.getElementById('saveaddfilter').addEventListener('click',function() {
    save_options(true) });
document.getElementById('change-layout').addEventListener('click',changeLayout);
document.getElementById('add-folder-button').addEventListener("click", function() {
      chrome.mediaGalleries.addUserSelectedFolder(getGalleriesInfo);
});
document.getElementById('targetdirlist').addEventListener('change',changeSelectOption);

//Populate the select element
populate_targetdir();
chrome.runtime.getBackgroundPage(function (bg) {
    scan_results = bg.scan_results;
    scan_gallData = bg.scan_gallData;
	document.getElementById('add').addEventListener('click',
	        add_scan_results);
    if (scan_results === undefined || scan_results.length == 0  ||  scan_gallData.length  != scan_results.length ) {
    	document.getElementById('addtext').textContent = "Please click on add to give permission and required gallaries!! This is one time step";
	    if(Object.keys(bg.directory_data).length > 5) {
            chrome.mediaGalleries.getMediaFileSystems(getGalleriesInfo);
        }
    //	document.getElementById("add").click();
    //	add_scan_results();
    } else {
	    //document.getElementById('add').remove();
        chrome.runtime.getBackgroundPage(function(bgp) {
            var filetype = getFileType(bgp.currentworkingfile.filename)
    		displayGallaries(filetype,bgp.currentworkingfile.filename,defaultdrawtype);
        });
    }

});

}

function add_scan_results() {
	chrome.mediaGalleries.addScanResults(getGalleriesInfo);
}

function  getDirectoryData(filetype) {
	var data ={};
	for(var i =0;i< scan_results.length;i++) {
		var directorylist = scan_gallData[i].gallDirectories.directories;
		for ( var j=0;j< directorylist.length;j++) {
            if (directorylist[j].type[filetype]> 0) {
                var filelist =  directorylist[j].fullPath;
	    		if (filelist == undefined) {
		    		filelist = scan_gallData[i].path; 
			    }
                var list=[]
                for (var file=0;file < directorylist[j].dirFiles.length;file++) {
                    list.push(directorylist[j].dirFiles[file].name);
                }
                
    			data[ filelist] = list;
	    	}
        }
	}
	return data;
}



function mouseover(d,i) {
	//Select correct circle
	var circle = d3.select("#circle"+i);
	var text = d3.select("#text"+i);
	console.log(d);
	text.text(d);
	//set the transition to expand circle with expand for 700ms
	circle.attr("stroke","black")
	.transition()
	.duration(700)
	.attr("r", 100);

	//Set the animantion on mouseout. to have yellow circle contracting when mouse go  out.
//	circle.on("mouseleave",mouseout);
	
//Creating Animation for out
	d3.select("svg").append("circle")
		.attr("cx", function(x,ind) { return xlinear(i - ((i%4)))+70;})
		.attr("cy", function(y,ind) { return (ylinear(2*(i%4)))+70;})
		.attr("r", 0)
		.style("fill", "green")
		.attr("opacity",0)
		.transition()
		.duration(600)
		.attr("r", 100)
		.attr("opacity",1)
		.remove();
console.log(circle);
console.log(i);
}

function mouseout(d,i) {
	var circle = d3.select("#circle"+i);
	var a = d.split("/");
	var text = d3.select("#text"+i);
	console.log(a[a.length-1]);
	text.text(a[a.length-1]);
	
	var currentlength = circle.property("r")["baseVal"]["value"];
	circle.attr("stroke","black")
	.text(a[a.length - 1])
	.transition()
	.duration(700)
	.attr("r", 40)

//Creating Animation.
	if ( currentlength > 40) {
		d3.select("svg").append("circle")
			.attr("cx", function(x,ind) { return xlinear(i - ((i%4)))+70;})
			.attr("cy", function(y,ind) { return (ylinear(2*(i%4)))+70;})
			.attr("r", 200)
			.style("fill", "yellow")
			.attr("opacity",0)
			.transition()
			.duration(600)
			.attr("r", 0)
			.attr("opacity",1)
			.remove();
				
	}
console.log(circle);
console.log(i);
}

function dblclick(d,i) {
    var targetdirectorieselem = document.getElementById("targetdirlist"); 
    var name = d.full_name.split("/");
    name.splice(name.length-1,1);
    var stringname = name.join("/");
    var gotvalue = false;
    for (var i=0;i < targetdirectorieselem.options.length;i++){
        if (targetdirectorieselem.options[i].value == stringname) {
            targetdirectorieselem.selectedIndex = i; 
            gotvalue = true;
        }
    }    
    changeSelectOption();
    if(!gotvalue ) {
        populate_targetdir();
    }
}
	
/*
function displayGallaries() {
	console.log("entering display galleries")
	//var  directories  = ["/","/home/gaurav","/home/gaurav/movies"];
	 directories  = getDirectoryData().splice(0,12);
	console.log(directories);
	//select th-
	var body = d3.select("body");

	//Append the svg element to body and set the properties.
	var svg =  body.append("svg")
		   .attr("width",900)
		   .attr("height",500);

	//Linear scale for placing the circles.

	xlinear = d3.scale.linear().
		domain([0,directories.length]).
		range(["0","900"]);

	ylinear = d3.scale.linear().
		domain([0,directories.length]).
		range(["0","500"]);


	var gmain = svg.selectAll("g circle");

	var ggroups = gmain.data(directories).enter()
		.append("g");


	var gcircle = ggroups.append("circle")
	    .attr("cx", function(x,i) { return xlinear(i - ((i%4)))+70;})
	    .attr("cy", function(y,i) { return (ylinear(2*(i%4)))+70;})
	    .attr("r", 40)
	    .style("fill", "blue")
	    .attr("id",function (d,i) { return "circle"+i;})
	    .on("click",mouseover)
	    .on("mouseout",mouseout)
	    .on("dblclick",dblclick);

	var gtext = ggroups.append("text")
	    .attr("x", function(d,i){return xlinear(i - ((i%4))) + 30;})
	    .attr("y", function(d,i){return (ylinear(2*(i%4))) + 30;})
	    .attr("dy", function(d,i){return 35;})
	    .attr("dx", function(d,i){return 20;})
	    .attr("id",function (d,i) { return "text"+i;})
	    .text(function(d){ var a =  d.split("/"); return a[a.length - 1]})
	    .attr("font-family", "sans-serif")
            .attr("font-size", "13px")
            .attr("font-weight", "bold")
            .attr("fill", "red");


	console.log("Leaving display galleries")
}

*/


document.addEventListener('DOMContentLoaded', restore_options);
