##DEMO

### 1 Install the app and extension

Get it up and running by installing  Organize download extension first followed by application. Your extension page should have both, similar to this one.
![screenshot](https://github.com/samuelharden/OrganizeDownload/raw/master/screenshots/extensions_page.png)

### 1A Inital setup will open for getting permission to folders and let you explore rules.

As soon as you application does somebackground work. It will open an inital setup menu if required.  Please give permission to Download folder an and other folder you want to move downloaded files.

Try setting the sample filters and explore filters.




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



