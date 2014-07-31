OrganizeDownload
================

Chrome extension to organize your downloads. It try to keep your download folder clean by moving files to location it should be on your local drive, rather than piling up all the downloads in your download directory. 

By default chrome will store download files to the pre-fixed download location like "/home/user/Downloads". After a while of downloading the files, download folder always becomes a mess. Where you cannot figure out what file is which. 

It would be much easier if i someone could manage, remember or atleast can move the files based on one time rules to predefined location.


##Overview 

Currently, this chrome application does two tasks:

1.  Check the currently downloaded file against the set of filters(Rules) set by the user. If any of the rule matches the currently downloaded file. Organize download will download the file and move the file to location set by rule.

2.  When you download the file which is compatible with above supported files, It will recommend you folder to store it. To reduce similar task in future it lets you add the filter for similar files, with little user effort.

Use Cases:

1. You download images from http://www.facebook.com. Set a rule to move files downloaded from facebook.com to  /home/user/Pictures/FB.All further images will be moved to that folder.

2. When you download a file, without thinking a lot about where to store it, get the possible suggestions where to store them.


##INSTALL   


Organize download application doesn't work alone. It's a combination of Chomium application and a Chromium extension both are names Organize download.

For the whole flow to work, you need to have both of them. extension is just a filler to get information of downloads, All hardwork is done by the organize download application. 

<a target="_blank" href="https://chrome.google.com/webstore/detail/organizedowload/pmbapjgcgcnocmllkbcehgljickgjiif"> Extension: ![Try it now in CWS](https://raw.github.com/GoogleChrome/chrome-app-samples/master/tryitnowbutton.png "Click here to install the Organize Download extension")</a>

<a target="_blank" href="https://chrome.google.com/webstore/detail/organize-download-app/ibnikgmjkdnijcigicjpnipibcieobdh"> APP:   ![Try it now in CWS](https://raw.github.com/GoogleChrome/chrome-app-samples/master/tryitnowbutton.png "Click here to install the Organize Dowload App")</a>

Note:Please install extension before application. This helps in application setup  procedure.


##Demo

https://github.com/samuelharden/OrganizeDownload/wiki/DEMO-of-Organize-download

##Currently Supported type of files


1. Image Files ('png', 'bmp', 'jpeg', 'jpg', 'gif', 'png', 'svg', 'xbm', 'webp').
2. Video Files ('3gp', '3gpp', 'avi', 'flv', 'mov', 'mpeg', 'mpeg4', 'mp4', 'ogg', 'webm', 'wmv').
3. Audio Files ('wav', 'mp3').

Chrome doesn't not allow apps to access the files other than media files. Hence we can only move these files and currently supported. If you know a way to access and copy, move, delete other type of files like pdf. Please let us know, we will be happy to make them compatible files.


## Contact

Have any question? drop a email at gauravarora dot daiict at gmail.com

