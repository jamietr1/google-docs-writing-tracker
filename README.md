google-docs-writing-tracker
===========================

<strong>Overview</strong>

The Google Docs writing tracker automates the process of logging how much you write each day. It does 3 main things:

  1. Gets a total word count for the day and logs the word count to a Google Spreadsheet.
  2. Generates an HTML file of of what you wrote today, including differences from yesterday.
  3. Sends the HTML file to an email address (I use my Evernote email for this).

The result is a spreadsheet containing the raw numbers, how much you wrote each day, and a daily email showing
exactly what you wrote each day, what changes you made, what you added and what you deleted from the previous day.

The writing tracker depends on a very specific configuration so please be sure to read the setup instructions
below.

Keep in mind that I originally developed this code for me, without thinking others would be using it. If it seems
cumbersome to setup, sorry! Also, USE IT AT YOUR OWN RISK. It works well for me, but I've been using it for
months and it was designed around my workstyle. People have asked that I make the code available, and I have done
that, but I have no time to support it. Feel free to email me with questions, but there is no guarantee that I will
be able to reply, or answer the questions. Again, sorry about this.

== Configuration ==

The writing tracker depends on you doing all of your writing within a single folder in Google Docs. Call this
folder your "Sandbox". Inside your sandbox you should keep all of your working documents. Also inside the 
Sandbox is a sub-folder called "Earlier" containing earlier versions of your working documents. You must create
this sub-folder, but the scripts should keep it up-to-date.

As currently designed, you should use the folder names as given above. In the future, I'll make this more
flexible, but when I designed this, it was originally for me and I didn't really think other people would be
using it.

Finally, the system uses a Google Spreadsheet. You can call this spreadsheet whatever you want. The scripts 
refer to it by it's file ID as opposed to its name. However, the spreadsheet MUST have a tab nammed "Writing".
This is where the daily word counts will be recorded. My spreadsheet is called "Writing Data" and I keep it in an
"Analytics" folder in Google Docs.

=== Setup ===

Please follow these instructions carefully. Getting a step wrong will likely cause the scripts to fail.

I. File System Setup

  1. Create a Google Spreadsheet to store your writing data.

      a. Name the first tab in the spreadsheet "Writing"
      b. Give cell A1 the label "Date"
      c. Give cell B2 the label "Words"
      d. Record the file ID of the spreadsheet. You can do this by copying it from the file URL:
      
         If your URL looks like this:
         
            https://docs.google.com/spreadsheet/ccc?key=0AmEvY6JjICyzHUWEkdivZmxmT18584hY#gid=0
            
         the file ID is the part between key= and #gid:
         
            0AmEvY6JjICyzHUWEkdivZmxmT18584hY
            
  2. Create a folder called "Scripts"
  3. Create a folder called "Sandbox"
  4. Create a sub-folder in "Sandbox" called "Earlier" 

II. Script Setup

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

III. Configuring the Automation

  1. In the script editor, select the code.gs file.
  2. From the Resources menu, select "Current Project's Triggers"
  3. Click the "No triggers setup. Click here to add one" link.
  4. Under "Run" select the "getDailyWordCount()" function.
  5. Under Events, select "Time-Driven" -> "Day Timer" -> "11pm - midnight"
  6. Click Save

This will call the getDailyWordCount() function once every day between 11pm and midnight. You won't have to
run the script manually. It will work automatically.

IV. Using the scripts

One you've set things up as listed above, all you should have to do it write. When you create a new document
that you want captured in your daily word count, but sure to put the document in your Sandbox folder. This is
where the script looks for documents and it is from here that it makes archival copies into the Earlier folder
so that is can produce a difference file.

CAUTION: You never want to edit the version of the file in the Sandbox/Earlier folder. These edits will be over-
written each night. When you go to edit a file in your Sandbox, BE SURE THAT IS IT IN YOUR SANDBOX FOLDER and NOT
the EARLIER folder.

I made my Sandbox folder a starred folder and have a shortcut to that folder that I use so that I don't
accidentally edit the earlier version of the file and lose my changes.

