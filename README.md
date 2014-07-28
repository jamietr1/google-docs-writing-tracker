google-docs-writing-tracker
===========================

# Overview

The Google Docs writing tracker automates the process of logging how much you write each day. It does 3 main things:

  1. Gets a total word count for the day and logs the word count to a Google Spreadsheet.
  2. Generates an HTML file of of what you wrote today, including differences from yesterday.
  3. Sends the HTML file to an email address (I use my Evernote email for this).
  4. Optionally generates a Daily Almanac email message summarizing your writing day, and highlighting any streaks or records you have set.

The result is a spreadsheet containing the raw numbers, how much you wrote each day, and a daily email showing exactly what you wrote each day, what changes you made, what you added and what you deleted from the previous day.

The writing tracker depends on a very specific configuration so please be sure to read the setup instructions below.

# A note on the (lack of) support

Keep in mind that I originally developed this code for me, without thinking others would be using it. If it seems cumbersome to setup, sorry! Also, <strong>USE IT AT YOUR OWN RISK</strong>. It works well for me, but I've been using it for over a year and it was designed around my work-style. People have asked that I make the code available, and I have done that, but I have no time to support it. Feel free to email me at feedback [at] jamietoddrubin dot com with questions, but there is no guarantee that I will be able to reply, or answer the questions. Again, sorry about this.

# Configuration

The writing tracker depends on you doing all of your writing within a single folder in Google Docs. Call this folder your "Sandbox". Inside your sandbox you should keep all of your working documents. Also inside the Sandbox is a sub-folder called "Earlier" containing earlier versions of your working documents. You must create this sub-folder, but the scripts should keep it up-to-date.

As currently designed, you should use the folder names as given above. In the future, I'll make this more flexible, but when I designed this, it was originally for me and I didn't really think other people would be using it.

Finally, the system uses a Google Spreadsheet. You can call this spreadsheet whatever you want. The scripts refer to it by it's file ID as opposed to its name. However, the spreadsheet MUST have a tab named "Writing". This is where the daily word counts will be recorded. My spreadsheet is called "Writing Data" and I keep it in an "Analytics" folder in Google Docs.

# Setting up the Writing Tracker

Please follow these instructions carefully. Getting a step wrong will likely cause the scripts to fail.

## I. File System Setup

  1. Create a Google Spreadsheet to store your writing data.

      a. Name the first tab in the spreadsheet "Writing"<br />
      b. Give cell A1 the label "Date"<br />
      c. Give cell B1 the label "Words"<br />
      d. Record the file ID of the spreadsheet. You can do this by copying it from the file URL:
      
```
         If your URL looks like this:
         
            https://docs.google.com/spreadsheet/ccc?key=0AmEvY6JjICyzHUWEkdivZmxmT18584hY#gid=0
            
         the file ID is the part between key= and #gid:
         
            0AmEvY6JjICyzHUWEkdivZmxmT18584hY
```         
  2. Create a folder called "Scripts"
  3. Create a folder called "Sandbox"
  4. Create a sub-folder in "Sandbox" called "Earlier" 

## II. Script Setup

The following steps take place in Google Drive. If you do not see a Script option when you click  on "Create" to create a new Google Doc, follows these one-time instructions (if you already have the Script app in your menu, you can skip to item B below.

A. One-time Google App Script install:

  1. Click on the Connect More Apps link at the bottom of the Create menu.
  2. Search for "Script"
  3. Select "Google App Script" from the search results
  4. Install the Google App Scripts

You should now have a "Script" option when you click on the Create menu in Google Drive.

Proceed with the following steps to complete the setup.

B. Google Doc Writing Tracker script setup:

  1. Create a new Script file called "WritingStats"
  2. When prompted for the type of project, select "Blank Project"
  3. Copy the code from "writing_stats.gs" (in GitHub) and paste it into the code.gs file.
  4. Create a new script file (File->New->Script File) and call it diff.gs.
  5. Copy the code from "diff.gs" (in GitHub) and paste it into the diff.gs file.
  6. Go into the "code.gs" script. There are four values that must be updated:

      var en_add = "<EMAIL ADDRESS>" -- replace with the email address you want the daily writing
                                        to be sent. (You can use your Evernote email if you want it
                                        to go to Evernote

      var SANDBOX = "Sandbox";       -- this is the name of your sandbox folder. I recommend using
                                        this name.
    
      var PREV_FOLDER = "Sandbox/Earlier"; -- this is the name of your "Earlier" folder. I recommend
                                              using this name.

      var QS_FILE = "<file Id>";     -- this is the file ID you recorded
                                        above in step I-1-d

You should have a Google App Script project now, with 2 scripts in it, code.gs and diff.gs.

## III. Configuring the Automation

  1. In the script editor, select the code.gs file.
  2. From the Resources menu, select "Current Project's Triggers"
  3. Click the "No triggers setup. Click here to add one" link.
  4. Under "Run" select the "getDailyWordCount()" function.
  5. Under Events, select "Time-Driven" -> "Day Timer" -> "11pm - midnight"
  6. Click Save

This will call the getDailyWordCount() function once every day between 11pm and midnight. You won't have to run the script manually. It will work automatically.

## IV. Using the scripts

One you've set things up as listed above, all you should have to do it write. When you create a  new document that you want captured in your daily word count, but sure to put the document in your Sandbox folder. This is where the script looks for documents and it is from here that it makes archival copies into the Earlier folder so that is can produce a difference file.

When I have finished a draft, I usually move the document out of my SANDBOX and into some other folder. I purge the Earlier version as well. When I start a new draft, I create a new file and drop it in my Sandbox. Wash. Rinse. Repeat.

The script should run each night between 11pm and midnight. This is Eastern Time. To change the script to your local time zone, search the code.gs for "EST" and made the proper substitution. I run the script at this time because I am generally done for the day and I want the script to capture the day's work. Some people may be night owls and want the script to run at other times. That's fine, but depending on when you run it, you might have to alter the date of the files the script looks for. Again, this was written with me and my habits in mind.

<strong>CAUTION</strong>: You never want to edit the version of the file in the Sandbox/Earlier folder. These edits will be over-written each night. When you go to edit a file in your Sandbox, be sure you are editing the Sandbox version and not the Sandbox/Earlier version. Changes to the latter will likely be overwritten by the script.

I made my Sandbox folder a starred folder and have a shortcut to that folder that I use so that I don't accidentally edit the earlier version of the file and lose my changes.

# Setting up the Daily Almanac

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

## 1. Setup the spreadsheet

Your Writing Data spreadsheet will need to be configured with several new tabs:

### Create the Goal tab.

If you don't already have a Goal tab, you need to create one.

1. Create a new tab in your Writing Data spreadsheet
2. Name the tab "Goal"
3. The Goals tab should have 2 columns that should look something like this:

| Date      | Goal      |
| ----------| ----------|
| 2/24/2013 | 500       |
| 12/1/2013 | 700       |
| 3/5/2014  | 500       |

4. Add a goal entry. You only need one. This is how many words you aim for each day.

Note: as your goal changes over time, don't erase it, just add the new goal, and the date on which you started the new goal below. This will provide a history in the data.

### Create the Records tab.

If you don't already have a Records tab, you need to create one.

1. Create a new tab in your Writing Data spreadsheet
2. Name the tab "Records"
3. The Records tab should have 5 columns that look like this:

| Type    | Date      | Max        | Streak    | Goal Streak |
| --------| ----------| -----------| ----------| ------------|
| Blogging| 1/1/2014  | 0          | 0         | 0           |
| Writing | 1/1/2014  | 0          | 0         | 0           |

The <strong>Streak</strong> column tracks the number of consecutive days you've written. The <strong>Goal Streak</strong> column tracks the number of consecutive days you've exceeded your personal goal.

4. If you already have a streak going, you can fill in the Streak value in the Writing row. For example, if you've written for 10 consecutive days, put a 10 in that cell.
5. Leave the blogging values blank. The version of the Writing Tracker I've released publicly does not track blogging.

### Create the Data tab

If you don't already have a Data tab, you need to created one.

1. Create a new tab in your Writing Data spreadsheet
2. Name the tab "Data"
3. There should be 4 cells in the tab, as follows:

| Day with now writing | 0  |
| ---------------------| ---|
| Total days           | 0  |

4. If you are just getting started, both values should be 0.

## 2. Install the Daily Almanac script

1. Create a new Script file called "DailyAlmanac"
2. When prompted for the type of project, select "Blank Project"
3. Copy the code from "daily_almanac.gs" (in GitHub) and paste it into the code.gs file.
4. Save the script.

## 3. Configure the Daily Almanac script

1. Open the DailyAlmanac script in code.gs.
2. The top section of the script contains the script configuration information that needs to be updated. Each of the following variable values needs to be updated as follows:

* ```QS_WRITING```: the ID of your Writing data spreadsheet. See instructions above for how to identify the ID.
* ```EVERNOTE_EMAIL```: the email address you want the Daily Almanac script sent to. I called the variable "Evernote_Email" because that is the address I use. By using my Evernote email address, all of my Daily Almanacs are sent to Evernote automatically. But you can actually use any valid email address that you like.

3. Don't touch the spreadsheet constants.
4. The execution parameters should be set as follows:

* VERSION = 1
* REPORT_BLOGGING = 0
* ```TEST_MODE``` = 0

If you change ```TEST_MODE = 1```, the script will run, and send the email message, but it won't make updates to your spreadsheet. This is a good way of previewing the message without actually making any changes. Just don't forget to set the TEST_MODE back to 0 when you are done testing.

## 4. Schedule the script to run nightly.

This script needs to run after the WritingStats script runs. The former runs on the same day you do your writing. The DailyAlmanac is designed to run on the following day, to report on what you did yesterday.

  1. In the script editor, select the code.gs file.
  2. From the Resources menu, select "Current Project's Triggers"
  3. Click the "No triggers setup. Click here to add one" link.
  4. Under "Run" select the "getAlmanacText()" function.
  5. Under Events, select "Time-Driven" -> "Day Timer" -> "Midnight - 1am"
  6. Click Save

This will call the getAlmanac() function once every day between midnight and 1 am. You won't have to run the script manually. It will work automatically.

<strong>Released under Creative Commons</strong>

<a rel="license" href="http://creativecommons.org/licenses/by-sa/3.0/deed.en_US"><img alt="Creative Commons License" style="border-width:0" src="http://i.creativecommons.org/l/by-sa/3.0/88x31.png" /></a><br /><span xmlns:dct="http://purl.org/dc/terms/" property="dct:title">Google Writing Tracker</span> by <a xmlns:cc="http://creativecommons.org/ns#" href="http://www.jamietoddrubin.com" property="cc:attributionName" rel="cc:attributionURL">Jamie Todd Rubin</a> is licensed under a <a rel="license" href="http://creativecommons.org/licenses/by-sa/3.0/deed.en_US">Creative Commons Attribution-ShareAlike 3.0 Unported License</a>.
