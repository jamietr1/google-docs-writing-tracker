// Google Writing Tracker


// Google Writing Tracker by Jamie Todd Rubin is licensed under a Creative Commons Attribution-ShareAlike 
// 3.0 Unported License.


// ------------------------------------------------------------------------------------------------------

// The following section sets variables that are customizable by user. Be sure to read the documentation
// as the code is written for a very specific process.

// Your Evernote email address goes below. This is used to email daily writing to your Evernote account.
var en_add = "<EVERNOTE EMAIL ADDRESS>"

// The name of your archive folder goes here. This is where the previous days work is copies for comparison
// to today's work. The default is "Sandbox/Earlier"
var PREV_FOLDER = "Sandbox/Earlier";

// The name of your sandbox folder goes below. This is the folder in which your working files go.
var SANDBOX = "Sandbox";

// The FILE ID (see documentation) of your Google Spreadsheet containing your writing data goes here
// I use the file "Analytics/Writing Data"
var QS_FILE = "<file id>"; 

var daily_diff = "";

// -----------------------------------------------------------------------------------------------------
// FUNCTIONS
// -----------------------------------------------------------------------------------------------------

// Function: getDailyWordCount
// Purpose:  Loops through any files in SANDBOX that have been modified today and gets the total word
//           count since yesterday. The word count is calculated by totaling the words for new files
//           and then totaling the words for existing files and subtracting yesterday's word count from
//           the SANDBOX/EARLIER folder. The word count is recorded in the QS_FILE, a Google Spreadsheet,
//           on the "Writing" tab of the spreadsheet. A new row is created with the date and the word
//           count. Finally, the day's writing, including changes from yesterday, are sent to Evernote via
//           your Evernote email account.
// Notes:    The function also creates the backup copies of today's files and puts them in the
//           SANDBOX/Earlier folder.

function getDailyWordCount() {
  daily_diff = "";
  var folder = DocsList.getFolder(SANDBOX);
  var copy_folder = DocsList.getFolder(PREV_FOLDER);
  var files = folder.getFiles();
  var today = Utilities.formatDate(new Date(), "EST", "yyyy-MM-dd");
  var word_count = 0;
  var local_diff = "";
  for (i in files) {
    Logger.log("Checking file: " + files[i].getName() + "...");
    if (today == Utilities.formatDate(files[i].getLastUpdated(), "EST", "yyyy-MM-dd")) {
      Logger.log("  -> File was modified today. Getting word count...");
      word_count += getFileWordCount(files[i].getId());
      
      // grab difference for Evernote
      local_diff = getFileDiff(files[i].getId());
      if (local_diff != "") {
        daily_diff = daily_diff + "<strong><p>" + files[i].getName() + "</strong></p>" + local_diff + "<hr>\n";
      }
      
      // backup the current version of the file
      backupFile(files[i].getId())
    }
  }
  
  //This could eventually be it's own function
  today = Utilities.formatDate(new Date(), "EST", "MM/dd/yyyy");
  
  var qs_doc = SpreadsheetApp.openById(QS_FILE);
  var sheet = qs_doc.getSheetByName("Writing");
  var range = sheet.getLastRow();
  range++;
  var dateCell = sheet.getRange("a" + range);
  var wordCell = sheet.getRange("b" + range);
  dateCell.setValue(today);
  wordCell.setValue(word_count);
  
  
  if (daily_diff != "") {
    // Send email to Evernote only if there has been changes or new writing
    var message = "<html><body>";
    var lines = daily_diff.match(/^.*((\r\n|\n|\r)|$)/gm);
    var cur_line = "";
    for (i in lines) {
      cur_line = lines[i];
      cur_line = cur_line.replace(/\r\n|\n|\r/, '');
      message = message + "<p>" + cur_line + "</p>";
    }
    message = message + "</body></html>";
    
    // Send the changes to Evernote <-- Only send if there was writing!
    Logger.log("  -> Sending email to Evernote");
    var subject = "Daily writing for " + today + " @Writing";
    MailApp.sendEmail(en_add, subject, "", {htmlBody: message});      
  } else {
    Logger.log("  -> Nothing new so no email send.");
  }
}


// Function: backupFile
// Purpose:  For a given file id, this function copies the file from the SANDBOX to the 
//           SANDBOX/Earlier folder. It sends old version of the file in SANDBOX/Earlier
//           to the trash.

function backupFile(id) {
  var folder = DocsList.getFolder(PREV_FOLDER);
  var orig = DocsList.getFileById(id);
  Logger.log("  -> Backing up " + orig.getName() + " to " + folder.getName() + "...");
  if (doesFileExistByName(PREV_FOLDER, orig.getName())){
    var files = folder.getFiles();
    for (f in files) {
      if (files[f].getName() == orig.getName()) {
        // ASSERT: we have a winner!
        files[f].setTrashed(true);
        Logger.log("  -> Removed older version to trash...");
        break;
      }
    }
  }
  orig.makeCopy(orig.getName()).addToFolder(folder);   
  Logger.log("  -> Backed up original file.");

}


// Function: doesFileExistByName
// Purpose:  Given a folder and a name, returns true if the file exists, or false if the 
//           file does not exist.

function doesFileExistByName(folder, name) {
  var found = false;
  var list = DocsList.getFolder(folder);
  var files = list.getFiles();
  for (f in files) {
    if ((files[f].getName() == name) && (files[f].isTrashed() == false)) {
      found = true;
      break;
    }
  }
  return found;
}

// Function: getFileDiff
// Purpose:  Given a file id, returns an html text string of the differences between file id in
//           SANDBOX and the previous day's version in SANDBOX/Earlier. The output is color-coded
//           so you can easily see what was added, removed and changed.

function getFileDiff(id) {
  var doc = DocumentApp.openById(id);
  var name = doc.getName();
  var doc1 = doc.getText();
  var count = getWordCount(doc1);
  var diff = "";
  
  // Is there a file from which to compare?
  Logger.log("  -> Checking file diff for " + name + "...");
  var folder = DocsList.getFolder(PREV_FOLDER);
  if (doesFileExistByName(PREV_FOLDER, name)) {
    Logger.log("  -> An earlier version of the file exists...");
    var files = folder.getFiles();
    for (f in files) {
      if (files[f].getName() == name) {
        var prev_doc = DocumentApp.openById(files[f].getId());
        var doc2 = prev_doc.getText();
        var diff = WDiffString(doc2, doc1)     
        if (diff == doc1) {
          diff = "";
        }
        break;
      }
    }
  } else { 
    // ASSERT: no previous file to compare
    diff = doc1;
  }
  
  Logger.log("--- FILE DIFF FOLLOWS ---\n" + diff + "\n--- FILE DIFF COMPLETE ---");
  Logger.log("--- ORIG FILE FOLLOWS ---\n" + doc1 + "\n--- ORIG FILE COMPLETE ---");
  return diff;
  
}


// Function: getFileWordCount
// Purpose:  Given a file id, returns the word count for that file in SANDBOX, adjusting the
//           count for the day's work only, by subtracting the count from the previous day, if
//           the file existed on the previous day.

function getFileWordCount(id) {
  var doc = DocumentApp.openById(id);
  var name = doc.getName();
  var doc1 = doc.getText();
  var count = getWordCount(doc1);
  var diff = "";
  
  // Does an earlier version exist?
  var folder = DocsList.getFolder("Sandbox/Earlier");
  if (doesFileExistByName("Sandbox/Earlier", name)) {
    var files = folder.getFiles();
    for (f in files) {
      if (files[f].getName() == name)
      {
        var prev_doc = DocumentApp.openById(files[f].getId());
        var doc2 = prev_doc.getText();
        var prev_count = getWordCount(doc2);
        count -= prev_count;
      }
    }
  } else {
    //diff = doc1;
  }
  
  return count;
}


// Function: getWordCount
// Purpose:  Given a text string, returns the number of words in that text string.

function getWordCount(text) {
  text = text.replace(/(^\s*)|(\s*$)/gi,"");
  text = text.replace(/[ ]{2,}/gi," ");
  text = text.replace(/\n /,"\n"); 
  return text.split(' ').length;
}

function chomp(raw_text)
{
  return raw_text.replace(/(\n|\r)+$/, '');
}
