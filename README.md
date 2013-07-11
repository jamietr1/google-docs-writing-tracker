google-docs-writing-tracker
===========================

== Overview ==

The Google Docs writing tracker automates the process of logging how much you write each day. It does 3 main things:

  1. Gets a total word count for the day and logs the word count to a Google Spreadsheet.
  2. Generates an HTML file of of what you wrote today, including differences from yesterday.
  3. Sends the HTML file to an email address (I use my Evernote email for this).

The result is a spreadsheet containing the raw numbers, how much you wrote each day, and a daily email showing
exactly what you wrote each day, what changes you made, what you added and what you deleted from the previous day.

The writing tracker depends on a very specific configuration so please be sure to read the setup instructions
below.

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
  3. 
  4. 
  2. Move the "WritingStats" file into your "Scripts" folder.
  3. 
            

