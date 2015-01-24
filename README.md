google-docs-writing-tracker
===========================

# Recent changes

* 01/24/15: Code was refactored to use DriveApp objects instead of DocsList objects. The latter were deprecated back in December, and while the functions still work, I wanted to make sure the code was up to current standards for Google App Scripts. There should be no deprecated code left in the code base. If you see any, let me know about it. One change is required in the spreadsheet config tab. The location of the Snapshot folder should refer only to the folder name rather than the full path. If you had, for instance "Sandbox\Earlier" as your snapshot folder name, it should be changed to "Earlier" for it to work correctly.
* 10/31/14: You can now use text based files (.txt, .md, .html, etc.) for your writing instead of Google Docs files. These files must be stored in your Sandbox folder on your Google Drive. Files of these types will be included in word counts. For now, however, only .md (markdown) files edited in Sublime Text are counted as part of the writing time for folks who have integrated with RescueTime.
* 8/10/14: A simple configuration verification system as been added to check for common problems to help users troubleshoot what might be wrong with their setup.
* 8/3/14: If an email address is not provided on the Config tab, no email will be sent. This provides an easy way to turn off email. Just clear out the value setting for the email field. I also updated the [master spreadsheet](https://docs.google.com/spreadsheet/ccc?key=0AmEvY6JjICyzdGU3aVFqeGVQX3JNRElaWDJlV2pxdlE&usp=sharing) so that the Email setting is now optional instead of required. Be sure to update your spreadsheet accordingly.

# Overview

The Google Docs Writing Tracker automates the process of logging and tracking how much you write each day:

  * It records daily word counts to a Google Spreadsheet.
  * It generates an email showing what you wrote, including differences from the previous day.
  * It generates a Daily Writing Almanac message that summarizes your writing stats, including streaks and records.
  
The Google Docs Writing Tracking is designed primarily for those who do their writing in Google Docs. However, I recently modified the code to allow any kind of text-based files to be tracked as well. So plain text files, markdown files, HTML, or any other file type that is plain text (not .DOC or DOCX, for instance) will work with the system.

# A note on the (lack of) support

Keep in mind that I originally developed this code for me, without thinking others would be using it. If it seems cumbersome to setup, sorry! Also, **USE IT AT YOUR OWN RISK** It works well for me, but I've been using it for over a year and it was designed around my work-style. People have asked that I make the code available, and I have done that, but I have no time to support it. Feel free to email me at feedback [at] jamietoddrubin dot com with questions, but there is no guarantee that I will be able to reply, or answer the questions. Again, sorry about this.

# New features 

* Application refactored to use DriveApp object model instead of the deprecated DocsList model.
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

Below is an overview of the process of getting started with the Google Docs Writing tracker. Note that the initial setup is a one-time only deal. Once they are setup and configured, the scripts should run in the background and track your writing automatically.

1. Copy the [Google Writing Tracker Data spreadsheet](https://docs.google.com/spreadsheet/ccc?key=0AmEvY6JjICyzdGU3aVFqeGVQX3JNRElaWDJlV2pxdlE&usp=sharing)
2. Configure the spreadsheet settings
3. Install the scripts.
4. Enable the triggers.

## 1. Copy the Google Writing Tracker Data spreadsheet

All of the data and settings meta-data for the Google Writing Tracker are now stored in the Writing Tracker spreadsheet. You can get a clean version of the spreadsheet [here](https://docs.google.com/spreadsheet/ccc?key=0AmEvY6JjICyzdGU3aVFqeGVQX3JNRElaWDJlV2pxdlE&usp=sharing).

1. Copy this file to a folder in your Google Drive.
2. Note the file ID of the spreadsheet in your folder. The ID is the part between key= and #gid in the URL. So if your URL is:

   https://docs.google.com/spreadsheet/ccc?key=0AmEvY6JjICyzdGU3aVFqeGVQX3JNRElaWDJlV2pxdlE#gid=42  
   the ID is  
   0AmEvY6JjICyzdGU3aVFqeGVQX3JNRElaWDJlV2pxdlE

3. Verify your spreadsheet has 6 tabs as follows:
  * Writing
  * Blogging
  * Goal
  * Records
  * Data
  * Config
4. If you are using an old version of the spreadsheet, copy your data from the Writing, Goals, Record, and Data tabs into the appropriate tabs on the new spreadsheet.
  * NOTE: When copying data from the old spreadsheet to the Writing tab, your total word counts should go in the Total column (Column D). Leave the Fiction/Nonfiction columns blank for now.

## 2. Configure the spreadsheet

1. Go to the Config tab. You will see something that looks like this:  

   ![alt text](https://github.com/jamietr1/google-docs-writing-tracker/blob/beta-version-2/images/GWT_Settings_1.png "Google Writing Tracker Settings")  

2. Fill in each of the **blank** required fields.
  * Put your values in the yellow (value) cells.
  * Putting a value into a required field will change the color of the Status field from red to green.
  * Fill in the optional fields as desired.
  * When all of the Required fields are green, you are all set.
  * Some basic instructions are in the Description column of the spreadsheet
  * For now, leave the default values alone.

### Some tips for the configuration

* The Sandbox location is the folder in which your Sandbox resides. This is where your working documents will live. If this folder is on your Google Drive root, simply provide the folder name:  

   Sandbox  

* If the Sandbox is located in a sub-folder off the root, you would assume your path starts at the root, e.g.:  

   Writing/Sandbox  

* The Snapshot location is what used to be called the "Earlier" folder. I tend to keep this as a subfolder of my Sandbox, e.g.:  

   Sandbox/Earlier  
   Writing/Sandbox/Earlier  

* You can now call either of this folders whatever you want.
* Don't include the full path of the Snapshot folder, just the name of the folder itself, .e.g. "Earlier"
* The email address is where the Daily Writing Summary and Daily Almanac will be sent. If you want these to go into Evernote automatically, use your Evernote email address.
* Set Test Mode to 1 if you want to run the scripts in test mode. This will still send email, but it will not make updates to the spreadsheet. It will also do some additional logging.
* Offset Days is the number of days to offset the date the Daily Almanac sends a summary for. If today is **July 31**, the table below gives some examples of how the offset setting works:. 

| Today's Date | Offset Setting | Date Almanac will Summarize |
| ------------ | -------------- | --------------------------- |
| 7/31/2014    | 1              | 7/30/2014                   |
| 7/31/2014    | 0              | 7/31/2014                   |
| 7/31/2014    | 2              | 7/29/2014                   |



### Tracking fiction and non-fiction word counts

By default, the Google Docs Writing Tracker will capture **total** daily word counts for documents in your sandbox. It can also break word counts into fiction and nonfiction. If you want to track fiction and non-fiction breakdowns, do the following:

1. Set the **Word Count Mode** value to 1
2. In each document you create, you will need a tag to indication whether it is fiction or non-fiction. The defaults are {{Fiction}} and {{Nonfiction}). I have a template for fiction and non-fiction that automatically include these tags at the bottom of the document.
3. For existing documents, you can go into your Sandbox and add the appropriate tag to each document.

Once enabled, the script will use these tags to break down word counts into fiction and non-fiction and include the total in the total column. These breakdowns get reported in the Daily Almanac as well.

## 3. Installing the scripts.

There are two sets of instructions here, one for new users, another for existing users:

### New Users

The process for installing the scripts involves 3 steps:

1. Install the Google App Script document
2. Create and copy the scripts
3. Install the triggers

#### 1. Install the Google App Script document

1. Go to Google Docs.
2. Click the New button.
3. On the popup menu, click the More... option.
4. In the next popup menu, check to see if there is a "Google Apps Script" option.
  * If it exists, continue to the next section below. Otherwise, follow the steps immediately below.
  * Click the Connect More Apps menu option.
  * In the popup window, type "Google Apps Script" in the search box and press ENTER
  * Google Apps Script should appear as the first item in the list. Click the +Connect button.
  * Return to Google Docs

#### 2. Create and copy the scripts

The following steps install the Google Docs Writing Tracker

1. In Google Docs, click the New button
2. From the popup menu, click More -> Google Apps Script.
3. In the Google Apps Script dialog, select "Blank Project" under "Create script for"
4. Click on Untitled Project above the Google Docs menu bar to rename the project.
5. In the Rename Project dialog, type "WritingStats"
6. Click OK.
7. From the File menu, select Project Properties...
8. In the Project Properties dialog, be sure that Time zone setting is set to your local time zone.
9. Click OK.
10. Open a new browser tab to the [writing_stats.gs](https://raw.githubusercontent.com/jamietr1/google-docs-writing-tracker/beta-version-2/writing_stats.gs) file on GitHub.
11. Select all of the code and copy it to the clipboard.
12. Go back to the Google WritingStats project
13. In the Code.gs window, highlight any text that appears there, and the paste in the code you just copied.
14. On line 3, replace the [YOUR FILE ID] text with the ID to your Google Writing Tracker spreadsheet that you noted above.
15. Click the Save button.
16. Click the File menu and select New->Script File...
17. In the Create File popup, type **diff.gs**.
18. Open a new browser tab to the [diff.gs](https://raw.githubusercontent.com/jamietr1/google-docs-writing-tracker/beta-version-2/diff.gs) file on GitHub.
19. Select all of the code and copy it to the clipboard.
20. Go back to the Google WritingStats project
21. In the **diff.gs** window, highlight any text that appears there, and the paste in the code you just copied.
22. Click the Save button.

The following steps install the Daily Almanac

1. In Google Docs, click the New button
2. From the popup menu, click More -> Google Apps Script.
3. In the Google Apps Script dialog, select "Blank Project" under "Create script for"
4. Click on Untitled Project above the Google Docs menu bar to rename the project.
5. In the Rename Project dialog, type "DailyAlmanac"
6. Click OK.
7. From the File menu, select Project Properties...
8. In the Project Properties dialog, be sure that Time zone setting is set to your local time zone.
9. Click OK.
10 Open a new browser tab to the [daily_almanac.gs](https://raw.githubusercontent.com/jamietr1/google-docs-writing-tracker/beta-version-2/daily_almanac.gs) file on GitHub.
11. Select all of the code and copy it to the clipboard.
12. Go back to the DailyAlmanac project
13. In the Code.gs window, highlight any text that appears there, and the paste in the code you just copied.
14. On line 5, replace the [YOUR FILE ID] text with the ID to your Google Writing Tracker spreadsheet that you noted above.
15. Click the Save button.

#### 3. Install the triggers

The triggers are what make the scripts run automatically each night to tally your word counts and send out email updates.

1. Open the WritingStats.gs in the Script Editor.
2. Select the code.gs file.
3. From the Resources menu, select "Current Project's Triggers"
4. Click the "No triggers setup. Click here to add one" link.
5. Under "Run" select the "**getDailyWordCount()**" function.
6. Under Events, select "Time-Driven" -> "Day Timer" -> "11pm - midnight"
7. Click Save
8. Open the DailyAlmanac.gs in the Script Editor.
9. In the script editor, select the code.gs file.
10. From the Resources menu, select "Current Project's Triggers"
11. Click the "No triggers setup. Click here to add one" link.
12. Under "Run" select the "**getAlmanacText()**" function.
13. Under Events, select "Time-Driven" -> "Day Timer" -> "Midnight - 1am"
14. Click Save

### Installation for existing users

1. Copy the code out of the [daily_almanac.gs](https://raw.githubusercontent.com/jamietr1/google-docs-writing-tracker/beta-version-2/daily_almanac.gs) in this branch.
2. Paste it into your existing Daily Almanac script, replacing the code that is there.
3. Copy the code out of the [writing_stats.gs](https://raw.githubusercontent.com/jamietr1/google-docs-writing-tracker/beta-version-2/writing_stats.gs) in this branch.
4. Paste it into your existing WritingStats script, replacing the code that is there.


# Using the scripts

This section describes how the scripts work and offers suggestions on how to use them.

## Definition of terms

* Sandbox: the folder that you designate as your working folder. It can be called anything you want. It is the folder represented by the Sandbox value on the Config tab in your spreadsheet.
* Snapshot folder: the folder in which snapshots of the previous days work are captured. It can be called anything you want. It is the folder represented by the Snapshot value on the Config tab in your spreadsheet. **Never make changes to documents in the Snapshot folder**. Always work in your Sandbox.

## How the scripts work

Once everything is properly installed, you only need to do 2 things:

1. Make sure your working files are in your Sandbox folder.
2. Write.

Each night, the scripts will look into your Sandbox folder for any Document files that have changed on that day. For each file that has changed, it will check to see if an earlier version exists in the snapshot folder. If it does, It will compared the two files, to get a word count for today. If no earlier version exists, it simply counts the words in the Sandbox version. It repeats this for all modified files.

You may do your writing in tools other than Google Docs, so long as the following criteria are met:

1. The files are plain text (.txt, markdown files, HTML, etc.). Word documents will not work.
2. The plain text files are stored in your Sandbox folder.

Once the words have been tallied, they are written to a new row on the Writing tab of the spreadsheet, and a summary of the changes, including differences from previous version is sent to the email address you specify in your configuration settings.

Later, the Daily Almanac script runs. It collects data about the day's writing, and also looks for any records or trends in the data. Then it generates  and sends a summary email message about your progress for the day.

When I have finished a draft, I usually move the document out of my SANDBOX and into some other folder. I purge the Spanshot version as well. When I start a new draft, I create a new file and drop it in my Sandbox. Wash. Rinse. Repeat.

The script should run each night between 11pm and midnight. The script uses your browser time zone to determine your time zone. I run the script at this time because I am generally done for the day and I want the script to capture the day's work. Some people may be night owls and want the script to run at other times. That's fine, but depending on when you run it, you might have to alter the date of the files the script looks for. Again, this was written with me and my habits in mind.

<strong>CAUTION</strong>: You never want to edit the version of the file in the Snapshot (formerly called "Earlier") folder. These edits will be over-written each night. When you go to edit a file in your Sandbox, be sure you are editing the Sandbox version and not the Snapshot version. Changes to the latter will likely be overwritten by the script.

**I made my Sandbox folder a starred folder and have a shortcut to that folder that I use so that I don't accidentally edit the earlier version of the file and lose my changes.**

## Setup your goals

I use goals as an arbitrary measure of what I aim for each day. Your daily goal will get recorded on the Writing tab of the spreadsheet each day, and will also be reported in the Daily Almanac

1. Go to the "Goal" tab.
2. The Goals tab should have 2 columns that should look something like this:  

| Date      | Goal      |
| ----------| ----------|
| 7/29/2014 | 500       |

3. The default is 500 words/day. Change this to whatever value you want.

**Note**: as your goal changes over time, don't erase it, just add the new goal, and the date on which you started the new goal below. This will provide a history in the data.

## Capturing your time spent writing with RescueTime.

If you use [RescueTime](http://www.rescuetime.com) to track your application usage, the Google Docs Writing Tracker can automatically capture the time you spend writing each day and add it to your spreadsheet. You will need to create an [API Key](https://www.rescuetime.com/anapi/setup/overview) Unless you know something about how API keys work, I don't recommend doing this. However, if you do have a RescueTime token, you can put that token in the appropriate setting field on the Config tab of your spreadsheet.

If the token is there, the script will grab a list of all of the time you spent on docs.google.com for that day, and filter it to just session involving Google Docs. It will total the time spent and add that to the Time column on your spreadsheet. **This is experimental** but so far, it's working pretty well for me, and the time is accurate based on my own control tracking.

## Email keyword substitution

Currently, you can customize the subject lines of the email message that goes our for the Daily Almanac and the Writing Summary. To customize these, place your desired subject line text in "Almanac Subject" or "Daily Writing Subject" value fields on the Config tab. If your version of the spreadsheet does not have these fields, you will need too add them in.

Each field can perform some simple keyword substitution.

### Daily Almanac Email Keywords

| Field            | Substitution String | Description                                               |
| -----------------| ------------------- | --------------------------------------------------------- |
| Almanac Date     | {{AlmanacDate}}     | The date for which the Almanac is reporting               |
| Total words      | {{TotalWords}}      | The total number of words written                         |
| Record Words     | {{RecordWords}}     | The most words ever written on a single day               |
| Record Date      | {{RecordDate}}      | The date on which the above record was set                |
| Total Days       | {{TotalDays}}       | The total number of days captured in the spreadsheet      |
| Writing Days     | {{WritingDays}}     | The total number of days you've written                   |
| Consecutive Days | {{ConsecutiveDays}} | The total number of consecutive days you've written       |
| Goal Streak      | {{GoalStreak}}      | The total number of consecutive days you've hit your goal |
| Goal Words       | {{GoalWords}}       | The current daily word goal                               |

Below are some examples of how you can set the subject line in the Config tab:

1. ```Daily Almanac for {{Almanac Date}}```  
2. ```Daily Almanac for {{Almanac Date}} ({{ConsecutiveDays}} days)```
3. ```{{AlmanacDate}} Writing Summary: {{TotalWords}} words```
4. ```{{AlmanacDate}} Writing Stats: {{TotalWords}} / {{GoalWords}}```

These correspond to the following output:

1. Daily Almanac for 08/01/2014
2. Daily Almanac for 08/01/2014 (374 days)
3. 08/01/2014 Writing Summary: 915 words
4. 08/01/2014 Writing Stats: 915 / 500 words

So you now have flexibility to completely customize the subject line. And yes, eventually I'm looking into making the email message a template that can also be customized.

### Daily Almanac Email Keywords

| Field            | Substitution String | Description                                               |
| -----------------| ------------------- | --------------------------------------------------------- |
| Writing Date     | {{WritingDate}}     | The date for which the summary is reporting               |
| Fiction Words    | {{FictionWords}}    | The total number of fiction words written                 |
| Nonfiction Words | {{NonfictionWords}} | The total number of nonfiction words written              |
| Total Words      | {{WritingDays}}     | The total number of words you've written                  |
| Goal Words       | {{GoalWords}}       | The current daily word goal                               |

<strong>Released under Creative Commons</strong>

<a rel="license" href="http://creativecommons.org/licenses/by-sa/3.0/deed.en_US"><img alt="Creative Commons License" style="border-width:0" src="http://i.creativecommons.org/l/by-sa/3.0/88x31.png" /></a><br /><span xmlns:dct="http://purl.org/dc/terms/" property="dct:title">Google Writing Tracker</span> by <a xmlns:cc="http://creativecommons.org/ns#" href="http://www.jamietoddrubin.com" property="cc:attributionName" rel="cc:attributionURL">Jamie Todd Rubin</a> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-sa/3.0/deed.en_US">Creative Commons Attribution-ShareAlike 3.0 Unported License</a>.
