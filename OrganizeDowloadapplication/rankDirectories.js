
//Function to calculate edit distance of two strings.
function editDistance(filename1,filename2) {
    var s1  = filename1.split("");
    var s2  = filename2.split("");
    var edi = new Array(s1.length);
    for (var i=0;i< s1.length;i++) {
        edi[i] = new Array(s2.length);
        edi[i][0] = i;
    } 
    for (var i=0;i< s2.length;i++) {
        edi[0][i] = i;
    } 


    for (var i=1;i<s1.length;i++) {
        for (var j=1;j<s2.length;j++) {
            var d1 = edi[i-1][j-1];
            if (s1[i] == s2[j]) {
                d1 = d1;
            } else {
                d1=d1+1;
            }
            var d2 = edi[i-1][j]+1;
            var d3 = edi[i][j-1]+1;
            var minimum =  Math.min(Math.min(d1,d2),d3);
            edi[i][j] = minimum; 
         
        }
    }
    return edi[s1.length-1][s2.length-1];
}

//print( editDistance("trails","zei"));

function getScore(filearray,filename) {
    var s=0;
    for (var file=0;file <filearray.length;file++) {
        s=s+editDistance(filearray[file],filename);
    } 
    var NormalizedScore = s/filearray.length ;
    return NormalizedScore;
}

function compare(a,b) {
    if (a[1] == b[1] ) {
        return 0;
    } else if (a[1] > b[1]) {
        return  1;
    } else {
        return -1;
    }
}

function calculateOldScore(old_item) {
    var s = 0;
    if (old_item) {
        for (var l =0; l < old_item.length; l++) {
            for ( key in old_item[l]) {
                if(old_item[l][key] && old_item[l][key] != "" && downloadObject[key] && downloadObject[key] != "") {
                    if( (new RegExp(old_item[l][key])).test(downloadObject[key])) {
                        s++;       
                    }        
                }
            }
        }
    }
    return s;
}
function getOldPrefScore(dirwithfilelist_,filename,old_item) {
    var oldscore = calculateOldScore(old_item);
    if (oldscore > 0 ) {
       return getScore(dirwithfilelist_,filename)/oldscore;
    } else {
        return getScore(dirwithfilelist_,filename)*2;
    }

}


function getRankedDirList(dirwithfilelist,filename,drawtype,callback) {
    chrome.storage.sync.get({'old_user_selections' : {}},function(item) {
        var sortablescorearray=[];
        for ( key in dirwithfilelist) {
             var old_pref_item = item.old_user_selections[key];
             sortablescorearray.push([key,getOldPrefScore(dirwithfilelist[key],filename,old_pref_item),dirwithfilelist[key]]);
        }
        sortablescorearray.sort(compare);
        console.log(sortablescorearray);
        var rlist=[];
        for (var l=0;l<sortablescorearray.length;l++) {
            rlist.push(sortablescorearray[l][0]);
        }
         callback(rlist,drawtype);
    }); 
}





