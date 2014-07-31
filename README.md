google-docs-writing-tracker
===========================

# Overview

If you use Google Docs, Google Writing Tracker automates the process of logging how much you write each day. It does 3 main things:

  1. Gets a total word count for the day and logs the word count to a Google Spreadsheet.
  2. Generates an HTML file of of what you wrote today, including differences from yesterday.
  3. Sends the HTML file to an email address (I use my Evernote email for this).
  4. Optionally generates a Daily Almanac email message summarizing your writing day, and highlighting any streaks or records you have set.

The result is a spreadsheet containing the raw numbers, how much you wrote each day, and a daily email showing exactly what you wrote each day, what changes you made, what you added and what you deleted from the previous day.

The writing tracker depends on a very specific configuration so please be sure to read the setup instructions below.

# Beta version

This is a beta version, published to the beta-version-2 branch. I have tested this fairly exhaustively in my own environment, but I also wrote the code for my environment, so things may be buggy. If you find a problem, please post an issue with as much details as possible.

# A note on the (lack of) support

Keep in mind that I originally developed this code for me, without thinking others would be using it. If it seems cumbersome to setup, sorry! Also, <strong>USE IT AT YOUR OWN RISK</strong>. It works well for me, but I've been using it for over a year and it was designed around my work-style. People have asked that I make the code available, and I have done that, but I have no time to support it. Feel free to email me at feedback [at] jamietoddrubin dot com with questions, but there is no guarantee that I will be able to reply, or answer the questions. Again, sorry about this.

# New features in the beta-version-2 branch

* Application completely refactored to be much more data-driven, making the setup and execution much easier.
* New base version of the Writing spreadsheet [available here](https://docs.google.com/spreadsheet/ccc?key=0AmEvY6JjICyzdGU3aVFqeGVQX3JNRElaWDJlV2pxdlE&usp=sharing).
* Ability to break daily word counts into fiction/nonfiction.
* Ability to run the scripts in test mode, to see results in log without making changes to the spreadsheet.
* Ability to customize the order of the columns on the Writing tab.
* Ability to customize the names of the tabs in the spreadsheet.
* Ability to customize the location of the Sandbox and Snapshot folders.
* Placeholders for tracking blogging word counts (not fully implemented in this version).
* Ability to automatically capture time spent writing for users of RescueTime.
* Ability to post Daily Almanac updates to Tumblr via email.
* Improved logging.
* Validation of configuration settings.

# Getting Started

Here is an overview of the process of getting started with the Google Writing tracker:

1. Copy and configure the [Google Writing Tracker Data spreadsheet](https://docs.google.com/spreadsheet/ccc?key=0AmEvY6JjICyzdGU3aVFqeGVQX3JNRElaWDJlV2pxdlE&usp=sharing)
2. Install the updated source files.

## Copy the Google Writing Tracker Data spreadsheet

All of the data and settings meta-data for the Google Writing Tracker are now stored in the Writing Tracker spreadsheet. You can get a clean version of the spreadsheet [here](https://docs.google.com/spreadsheet/ccc?key=0AmEvY6JjICyzdGU3aVFqeGVQX3JNRElaWDJlV2pxdlE&usp=sharing).

1. Copy this file to a folder in your Google Drive.
2. Note the file ID of the spreadsheet in your folder. The ID is the part between key= and #gid in the URL. So if your URL is:
  https://docs.google.com/spreadsheet/ccc?key=0AmEvY6JjICyzdGU3aVFqeGVQX3JNRElaWDJlV2pxdlE#gid=42
the ID is
  0AmEvY6JjICyzdGU3aVFqeGVQX3JNRElaWDJlV2pxdlE
3. Open the spreadsheet.
4. Verify your spreadsheet has 6 tabs as follows:
  * Writing
  * Blogging
  * Goal
  * Records
  * Data
  * Config
6. From the File menu, select Spreadsheet Settings...
7. Set the Time Zone to your local time zone.
8. If you are using an old version of the spreadsheet, copy your data from the Writing, Goals, Record, and Data tabs into the appropriate tabs on the new spreadsheet.
  * NOTE: When copying data from the old spreadsheet to the Writing tab, your word counts should go in the Total column (Column D). Leave the Fiction/Nonfiction columns blank for now.

## Configure the spreadsheet

1. Go to the Config tab. You will see something that looks like this:

![alt text](https://github.com/jamietr1/google-docs-writing-tracker/blob/beta-version-2/images/GWT_Settings_1.png "Google Writing Tracker Settings")

2. Fill in each of the **blank** required fields.
  * Put the values in the yellow (value) cells.
  * Putting a value into a required field will change the color of the Status field to green.
  * Fill in the optional fields as desired.
  * When all of the Required fields are green, you are all set.
  * Some basic instructions are in the Description column of the spreadsheet
  * For now, leave the default values alone.

### Some tips for the configuration

* The Sandbox location is the folder in which your Sandbox resides. This is where your working documents will live. If this folder is on your Google Drive root, simply provide the folder name:

  Sandbox
  
* If the Sandbox is located in a subfolder off the root, you would assume your path starts at the root, e.g.:

  Writing/Sandbox
  
* The Snapshot location is what used to be called the "Earlier" folder. I tend to keep this as a subfolder of my Sandbox, e.g.:

  Sandbox/Earlier
  Writing/Sandbox/Earlier

* Of course, you can now call either of this folders whatever you want.
* The email address is where the Daily Writing Summary and Daily Almanac will be sent. If you want these to go into Evernote automatically, use your Evernote email address.
* Set Test Mode to 1 if you want to run the scripts in test mode. This will still send email, but it will not make updates to the spreadsheet. It will also do some additional logging.
* Offset Days is the number of days to offset the date for the Daily Alamanc. I schedule the Daily Almanac to run between midnight and 1 am, so I set my Offset Days to 1. This tells the Daily Almanac to use yesterday's data (today - 1). If you have the Daily Almanac run on the same day as you do your writing, set the Offset Days to 0.

### Tracking fiction and nonfiction word counts

By default, the Google Writing Tracker will capture total daily word counts for documents in your sandbox. If you want to track fiction and nonfiction breakdowns, do the following:

1. Set the Word Count Mode value to 1
2. In each document you create, you will need a tag to indication whether it is fiction or nonfiction. The defaults are {{Fiction}} and {{Nonfiction}). I have a template for fiction and nonfiction that automatically include these tags at the bottom of the document.
3. For existing documents, you can go into your Sandbox and add the appropriate tag to each document.

Once enabled, the script will use these tags to break down word counts into fiction and nonfiction and include the total in the total column. These breakdowns get reported in the Daily Almanac as well.

# Installing and configuring the source files.

There are two sets of instructions here, one for existing users, another for new users:

## Installation for existing users

1. Copy the code out of the Daily Almanac script in this branch.
2. Paste it into your exising Daily Almanac script, replacing the code that is there.
3. Copy the code out of the WritingStats script in this branch.
4. Paste it into your exising WritingStats script, replacing the code that is there.

## Installation for new users

### One-time Google App Script install:

  1. Click on the Connect More Apps link at the bottom of the Create menu.
  2. Search for "Script"
  3. Select "Google App Script" from the search results
  4. Install the Google App Scripts

You should now have a "Script" option when you click on the Create menu in Google Drive.

Proceed with the following steps to complete the setup.

### Install the scripts:

  1. Create a new Script file called "WritingStats"
  2. When prompted for the type of project, select "Blank Project"
  3. Copy the code from "writing_stats.gs" (in GitHub) and paste it into the code.gs file.
  4. Create a new script file (File->New->Script File) and call it diff.gs.
  5. Copy the code from "diff.gs" (in GitHub) and paste it into the diff.gs file.
  6. From the File menu select Project Properties...
  7. Set the project time zone to your local time zone.
  8. Save the files.

### Configuring the Automation

  1. Open the WritingStats.gs in the Script Editor.
  2. Select the code.gs file.
  3. From the Resources menu, select "Current Project's Triggers"
  4. Click the "No triggers setup. Click here to add one" link.
  5. Under "Run" select the "getDailyWordCount()" function.
  6. Under Events, select "Time-Driven" -> "Day Timer" -> "11pm - midnight"
  7. Click Save

This will call the getDailyWordCount() function once every day between 11pm and midnight. You won't have to run the script manually. It will work automatically.

  1. Open the DailyAlmanac.gs in the Script Editor.
  1. In the script editor, select the code.gs file.
  2. From the Resources menu, select "Current Project's Triggers"
  3. Click the "No triggers setup. Click here to add one" link.
  4. Under "Run" select the "getAlmanacText()" function.
  5. Under Events, select "Time-Driven" -> "Day Timer" -> "Midnight - 1am"
  6. Click Save

## Configuration (all users)

  1. Open the WritingStat.gs file in the Script Editor
  2. Set the file ID in line 3, using the key from the new Writing Data spreadsheet above.
  
  var WRITING_DATA = "[YOUR KEY GOES HERE]";  

  3. Click Save.
  4. Open the DailyAlmanac.gs file in the Script Editor
  5. Set the file ID in line 5, using the same key you used in Step 2 above.
  6. Click Save.

# Using the scripts

One you've set things up as listed above, all you should have to do it write. When you create a  new document that you want captured in your daily word count, but sure to put the document in your Sandbox folder. This is where the script looks for documents and it is from here that it makes archival copies into the Snapshot folder so that is can produce a difference file.

When I have finished a draft, I usually move the document out of my SANDBOX and into some other folder. I purge the Spanshot version as well. When I start a new draft, I create a new file and drop it in my Sandbox. Wash. Rinse. Repeat.

The script should run each night between 11pm and midnight. The script uses your browser time zone to determine your timezone. I run the script at this time because I am generally done for the day and I want the script to capture the day's work. Some people may be night owls and want the script to run at other times. That's fine, but depending on when you run it, you might have to alter the date of the files the script looks for. Again, this was written with me and my habits in mind.

<strong>CAUTION</strong>: You never want to edit the version of the file in the Snapshot (formerly called "Earlier") folder. These edits will be over-written each night. When you go to edit a file in your Sandbox, be sure you are editing the Sandbox version and not the Snapshot version. Changes to the latter will likely be overwritten by the script.

I made my Sandbox folder a starred folder and have a shortcut to that folder that I use so that I don't accidentally edit the earlier version of the file and lose my changes.

# About the Daily Almanac

The Daily Almanac is a script that sends out a daily email message to an address that you provide. The message includes information about how much you wrote on the previous day, and also highlights and streaks or records you may have set. Here is what a typical Daily Almanac message looks like for me:

   Subject: Daily Almanac for 07/23/2014 @timeline
 
   <strong>Writing summary</strong>
   You wrote a total of <strong>1957</strong> words. These breakdown as follows:

   <strong>Fiction/Nonfiction</strong>
      * Current daily writing goal: 500 words
      * You wrote: 1155 words
      * You have now written for 510 out of the last 512 days.
      * You have now written for 367 consecutive days.
           * That is a new consecutive-day record!
      * You exceeded your daily writing goal of 500 words by 655 words.
      * You've hit your goal for 5 consecutive days.

If you would like to get an email like this every day, follow the instructions below to configure the script on Google Docs.

## Setup your goals

I use goals as an arbitrary measure of what I aim for each day. Your daily goal will get recorded on the Writing tab of the spreadsheet each day, and will also be reported in the Daily Almanac

1. Go to the "Goal" tab.
2. The Goals tab should have 2 columns that should look something like this:

| Date      | Goal      |
| ----------| ----------|
| 7/29/2014 | 500       |

3. The default is 500 words/day. Change this to whatever value you want.


**Note**: as your goal changes over time, don't erase it, just add the new goal, and the date on which you started the new goal below. This will provide a history in the data.


<strong>Released under Creative Commons</strong>

<a rel="license" href="http://creativecommons.org/licenses/by-sa/3.0/deed.en_US"><img alt="Creative Commons License" style="border-width:0" src="http://i.creativecommons.org/l/by-sa/3.0/88x31.png" /></a><br /><span xmlns:dct="http://purl.org/dc/terms/" property="dct:title">Google Writing Tracker</span> by <a xmlns:cc="http://creativecommons.org/ns#" href="http://www.jamietoddrubin.com" property="cc:attributionName" rel="cc:attributionURL">Jamie Todd Rubin</a> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-sa/3.0/deed.en_US">Creative Commons Attribution-ShareAlike 3.0 Unported License</a>.
