
var scan_results;
var scan_resultsindex = 0;
var scan_gallData = [];
var scan_reader = null;
var scan_directories = [];
var dire_entry;
var directories;
var xlinear;
var ylinear;


function errorPrintFactory(custom) {
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
   };
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
		if (scan_directories.length >0) {
//			console.log("scan dir lengh : "+scan_directories.length);
			dire_entry = scan_directories.shift();
//			console.log("scan dir lengh : "+scan_directories.length);
			scan_reader = dire_entry.createReader();
			//console.log("Scanning sub directories : "+dire_entry.fullPath +" " + dire_entry.name);
			scan_reader.readEntries(scanGallery,errorPrintFactory('scanning sub directory'));
		}
		else {
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
				displayGallaries();
			}	
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
	scan_reader.readEntries(scanGallery,errorPrintFactory('read more Entries'));
}

function scanGalleries (fs) {
	var gallData = chrome.mediaGalleries.getMediaFileSystemMetadata(fs);
	console.log("Scanning New gallery+ :"+gallData.name);
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
document.getElementById('add-folder-button').addEventListener("click", function() {
      chrome.mediaGalleries.addUserSelectedFolder(getGalleriesInfo);
});
chrome.runtime.getBackgroundPage(function (bg) {
    scan_results = bg.scan_results;
    scan_gallData = bg.scan_gallData;
    if (scan_results === undefined || scan_results.length == 0  ||  scan_gallData.length  != scan_results.length ) {
	    document.getElementById('add').addEventListener('click',
	        add_scan_results);
    	document.getElementById('addtext').textContent = "Please click on add to give permission and required gallaries!! This is one time step";
	
    //	document.getElementById("add").click();
    //	add_scan_results();
    } else {
	    document.getElementById('add').remove();
		displayGallaries();
    }

});

}

function add_scan_results() {
	chrome.mediaGalleries.addScanResults(getGalleriesInfo);
}

function  getDirectoryData() {
	var data =[];
	for(var i =0;i< scan_results.length;i++) {
		var directorylist = scan_gallData[i].gallDirectories.directories;
		for ( var j=0;j< directorylist.length;j++) {
			var filelist = directorylist[j].direntry.fullPath;
			if (filelist == undefined) {
				filelist = scan_gallData[i].path; 
			}
			data[data.length] = filelist;
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
document.getElementById('namefield').value = d.full_name ;
	
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
