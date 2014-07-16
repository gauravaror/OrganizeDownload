OrganizeDownload
================

Chrome extension to organize your downloads. It try to keep your download folder clean by files to location it should be on your local drive, rather than piling up all the downloads in your download directory. 

##Problem Statement


By default chrome will store download files to the pre-fixed download location like "/home/user/Downloads". After a while of downloading the files, download folder always becomes a mess. Where you cannot figure out what file is which. 

It would be much easier if i someone could manage, remember or atleast can move the files based on one time rules to predefined location.


##Currently Supported type of files


1. Image Files ('png', 'bmp', 'jpeg', 'jpg', 'gif', 'png', 'svg', 'xbm', 'webp').
2. Video Files ('3gp', '3gpp', 'avi', 'flv', 'mov', 'mpeg', 'mpeg4', 'mp4', 'ogg', 'webm', 'wmv').
3. Audio Files ('wav', 'mp3').

Chrome doesn't not allow apps to access the files other than media files. Hence we can only move these files and currently supported. If you know a way to access and copy, move, delete other type of files like pdf. Please let us know, we will be happy to make them compatible files.


##Solution


Ideal solution would be where once you download file, without human intervention it would be relocated to the desired location!! we are not there yet but, i guess we can.

Currently, this chrome application does two tasks:

1.  Check the currently downloaded file against the set of filters(Rules) set by the user. If any of the rule matches the currently downloaded file. Without asking you,  it will download the file and move the file to location set by rule.

2.  When you download the file which is compatible with above supported files, It will intelligently pick the folders where you might want to store the file being downloded. It will show you the folder, and let yo choose where you want to store the file. Best is for future it lets you add the filter for similar files, with little user effort. So that you are not again bothered in future for the same mundane task.


##Use Case 


1. Every day you download images from http://www.facebook.com, but they end up being mix with some junk in download folder, because we are two lazy. Set a rule saying move all the files downloaded from facebook.com to folder names, /home/user/Pictures/FB and you are done. You dont need to worry about moving any image downloded from facebook.com to the correct folder.

2. When you download a file, without thinking a lot about where to store it, get the possible suggestions where to store them.


##INSTALL   


Organize download application doesn't work alone. It's a combination of Chomium application and a Chromium extension both are names Organize download.

For the whole flow to work, you need to have both of them. extension is just a filler to get information of downloads, All hardwork is done by the organize download application.


##Demo

### 1 Install the app and extension

Get it up and running by installing both the Organize download app and Organize download extension. Your extension page should have both, similar to this one.
![screenshot](https://github.com/samuelharden/OrganizeDownload/raw/master/screenshots/extensions_page.png)

If you have both of them, you are good to go.

###  2 Get the application going

 Try to download a image file from maybe facebook.com. Select menu similar to this one will appear in front of you.

![screenshot](https://github.com/samuelharden/OrganizeDownload/raw/master/screenshots/selectpagebeforeaddinggallery.png)

But, It doesn't show you which folders you can download the file in visualization. currently, there is a manual step where user need to click on the Add button on the button panel. We are trying to remove this step too.

###  3 Getting the most likely folders to send file is one step far.

After clicking the Add button from the panel, Following visualization showing which folders are most likely for this file will appear:

![screenshot](https://github.com/samuelharden/OrganizeDownload/raw/master/screenshots/selectpageafteraddinggallerydendogramlayout.png)

###  4 Highlighting the full path of folder

Placing the curser on any of the nodes in visualization, will highlight all the nodes in the full path of the folder to make it easy for you to make  decision.

![screenshot](https://github.com/samuelharden/OrganizeDownload/raw/master/screenshots/selectpagedendogramlayout_highlightedpath.png)

###  5  Exploring force layout

If you don't like this layout , you can switch and play around with the force layout, its fun to play with that layout.

![screenshot](https://github.com/samuelharden/OrganizeDownload/raw/master/screenshots/selectpageforcelayout.png)

placing curser on any node highlight the full path in this visualization also.

![screenshot](https://github.com/samuelharden/OrganizeDownload/raw/master/screenshots/selectpageforcelayout_highlighedpath.png)

### 6 Select the folder by clicking node in visualization.

If you click on any of the node in visualization, if it is possible to move the file to that location , we change the selection above to choose the folder for you.

After that all you have to do is click on Save or Save and Add Filter to get the file moving to your folder.

![screenshot](https://github.com/samuelharden/OrganizeDownload/raw/master/screenshots/selectpagedendogram_clickchangesselctedfolder.png)

In above screenshot, selection has been changed to reflect the click.

### 7 Save the file and add filter with recommended values from current download

If you click on Save and Add Filter option , this will save the file to the location where you asked it to move.
Parallely it checks the download for properties like referrer of image,url of image, mime type of image,  and open filter addintion window with suggestion values from the current download, so that after adding this rule all similar files will go to the correct folder withoug manual intervention.

![screenshot](https://github.com/samuelharden/OrganizeDownload/raw/master/screenshots/saveandaddfilter_openfilterwithpopulatedvalues.png)


### 8 Add folders not available in the list

Add Gallery option on select menu allows you to add folder to the list of folders if it is not shown currently. Clicking this option will open the open file chooser to choose the folder you want to add.

![screenshot](https://github.com/samuelharden/OrganizeDownload/raw/master/screenshots/addgalllery_openfilechooser.png)

### 9 Adding filter.

 you can manage the filter without downloading the file by simply launching the app from extensions page. Following filter screen will appear , you can add or delete the filter, currently you cannot modify it.

Filter have follwing field:
1.  URL
2.  Referrer
3.  MIME Type
4. FileName
5. Available Target Directories


In all the filed except target directories, you should put a string which you think should be present in the value. like for urls and referrers you can put hostname of the website, simply put facebook in referrer  for downloading images from www.facebook.com . Internally its a regex check, you can put any regex expression if you want.

![screenshot](https://github.com/samuelharden/OrganizeDownload/raw/master/screenshots/filter_page.png)


## Contact

Have any question? drop a email at gauravarora<dot>daiict<at>gmail.com

