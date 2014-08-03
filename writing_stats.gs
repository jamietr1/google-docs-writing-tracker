var daily_diff = "";
var error_count = 0;
var WRITING_DATA = "[YOUR FILE ID]";                              

var TEST_MODE = loadConfigData("Test Mode");
var EMAIL_ADDRESS = loadConfigData("Email Address");
var SANDBOX = loadConfigData("Sandbox Location");
var SNAPSHOT_FOLDER = loadConfigData("Snapshot Location");

/* Use the time zone of the current session, which should correspond to the user's
   time zone if their browser settings are correct */
var TIME_ZONE = Session.getTimeZone();

var SHEET_WRITING = loadConfigData("Writing Sheet");
var SHEET_GOAL = loadConfigData("Goal Sheet");

/* Constants for records tab */

var RECORD_WRITING_STREAK = loadConfigData("Writing Streak");
var RECORD_BLOGGING_STREAK = loadConfigData("Blogging Streak");
var RECORD_WRITING_WORDS = loadConfigData("Words Record");
var RECORD_BLOGGING_WORDS = loadConfigData("Blogging Record");
var RECORD_WRITING_DATE = loadConfigData("Writing Record Date");
var RECORD_BLOGGING_DATE = loadConfigData("Blogging Record Date");
var RECORD_WRITING_GOAL_STREAK = loadConfigData("Writing Goal Streak");
var RECORD_BLOGGING_GOAL_STREAK = loadConfigData("Blogging Goal Streak");

/* Constants for Writing tab */
var WRITING_DATE = loadConfigData("Writing Date");
var WRITING_FICTION = loadConfigData("Writing Fiction");
var WRITING_NONFICTION = loadConfigData("Writing Nonfiction");
var WRITING_TOTAL = loadConfigData("Writing Total");
var WRITING_AVERAGE = loadConfigData("Writing Average");
var WRITING_GOAL = loadConfigData("Writing Goal");
var WRITING_TIME = loadConfigData("Writing Time");

/* Execution parameters */
var FICTION_TAG = loadConfigData("Fiction Tag");
var NONFICTION_TAG = loadConfigData("Nonfiction Tag");
var RESCUETIME_TOKEN = loadConfigData("RescueTime Token");
var MODE = loadConfigData("Word Count Mode");

/* Email customization */
var EMAIL_SUBJECT = loadConfigData("Daily Writing Subject");

  

function find(value, range) {
  var data = range.getValues();
  for (var i = 0; i < data.length; i++) {
    for (var j = 0; j < data[i].length; j++) {
      if (data[i][j] == value) {        
        return range.getCell(i + 1, j + 2);
      }
    }
  }
  return null;  
}


function loadConfigData(setting) {
  var ss = SpreadsheetApp.openById(WRITING_DATA)
  var config_sheet = ss.getSheetByName("Config");
  var last_row = config_sheet.getLastRow();
  var range = config_sheet.getRange("A2:B" + last_row);
  var row = find(setting, range);
  if (row == null)
    throw new Error ("ERROR: Could not find setting '" + setting + "' in the Config tab.");
  else {
    var row_result = row.getRow();
    var result = config_sheet.getRange("B" + row_result).getValue();
    if (config_sheet.getRange("C" + row_result).getValue() == "Required" && result == "") {
      error_count++;
      Logger.log("ERROR: Required setting '" + setting + "' is not set on the Config tab.");
    }
    return result;
  }                           
}

function testHarness()
{
  getDailyWordCount(8, 1, 2014);
}

function initializeWritingStats() 
{
  initNamedRangeCell("RecordBloggingStreak", "Records", RECORD_BLOGGING_STREAK);
  initNamedRangeCell("RecordWritingStreak", "Records", RECORD_WRITING_STREAK);
  initNamedRangeCell("RecordBloggingWords", "Records", RECORD_BLOGGING_WORDS);
  initNamedRangeCell("RecordWritingWords", "Records", RECORD_WRITING_WORDS);
  initNamedRangeCell("RecordBloggingDate", "Records", RECORD_BLOGGING_DATE);
  initNamedRangeCell("RecordWritingDate", "Records", RECORD_WRITING_DATE);  
  initNamedRangeCell("RecordBloggingGoalStreak", "Records", RECORD_BLOGGING_GOAL_STREAK);
  initNamedRangeCell("RecordWritingGoalStreak", "Records", RECORD_WRITING_GOAL_STREAK);
}

                         
function initNamedRangeCell(strRangeName, strSheetName, strCell)                         
{
  var ss = SpreadsheetApp.openById(WRITING_DATA);
  if (ss.getRangeByName(strRangeName) == null)
    ss.setNamedRange(strRangeName, ss.getSheetByName(strSheetName).getRange(strCell));
}

function getDailyWordCount() {
  if (error_count > 0)
  {
    throw new Error ("Not all required configuration settings have been set. See View->Logs for details.");
  }
  
  if (TEST_MODE == 1) {
    Logger.log("Running in test mode. No actual changes will be made.");
    Logger.log(EMAIL_ADDRESS);    
  }
  
  
  daily_diff = "";
  var folder = DocsList.getFolder(SANDBOX);
  var copy_folder = DocsList.getFolder(SNAPSHOT_FOLDER);
  
  /* Corrects Issue 2: gets only Document files */
  var files = folder.getFilesByType(DocsList.FileType.DOCUMENT);
  
  if (arguments.length == 3) {
    /* ASSERT: month, day and year provided. This is almost always called from the testHarness() function */
    var pMonth = arguments[0];
    var pDay = arguments[1];
    var pYear = arguments[2];
    pMonth--;
    pDay;
    var today = Utilities.formatDate(new Date(pYear, pMonth, pDay), TIME_ZONE, "yyyy-MM-dd");
    Logger.log("Date passed in as parameter: " + today);        
  } else {
    /* ASSERT: no date parameter provided so use the current date */
    var today = Utilities.formatDate(new Date(), TIME_ZONE, "yyyy-MM-dd");
    Logger.log("Date not passed in. Using current date: " + today);       
  }

  if (TEST_MODE == 1)
    Logger.log("Processing date: " + today);
    
  var words_fiction = 0;
  var words_nonfiction = 0;
  var word_count = 0;
  var local_diff = "";
  var writing_type = "";
  var moving_average = "";
  var daily_goal = getWritingGoal();
  
  for (i in files) {
    /* INV: loop through all of the files */
    Logger.log("Checking file: " + files[i].getName() + "...");
    if (today == Utilities.formatDate(files[i].getLastUpdated(), TIME_ZONE, "yyyy-MM-dd")) {
      Logger.log("  -> File was modified today. Getting word count...");
      if (MODE == 1) {
        writingType = getWritingType(files[i].getId());
        if (writingType == "Fiction") {
          words_fiction += getFileWordCount(files[i].getId());
          Logger.log("Counted: " + words_fiction + " fiction words");
        } else {
          words_nonfiction += getFileWordCount(files[i].getId());
          Logger.log("Counted: " + words_nonfiction + " nonfiction words.");
        }
      } else {
        words_fiction += getFileWordCount(files[i].getId()); 
      }
                                                         
      // grab difference for Evernote
      local_diff = getFileDiff(files[i].getId());
      if (local_diff != "") {
        daily_diff = daily_diff + "<strong><p>" + files[i].getName() + "</strong></p>" + local_diff + "<hr>\n";
      }
      
      // backup the current version of the file
      if (TEST_MODE == 1)
        Logger.log("TEST MODE: Original/Old files will be untouched.");
      else
        backupFile(files[i].getId())
    }
  }
  
  /* Grab total time spent writing from RescueTime */
  if (RESCUETIME_TOKEN != "" && RESCUETIME_TOKEN != null)
    var time_total = getWritingTime(today);
  else
    var time_total = "";
  
  var qs_doc = SpreadsheetApp.openById(WRITING_DATA);
  var sheet = qs_doc.getSheetByName(SHEET_WRITING);
  var range = sheet.getLastRow();
  range++;
  
  var dateCell = sheet.getRange(WRITING_DATE + range);
  var ficWordCell = sheet.getRange(WRITING_FICTION + range);
  var nfWordCell = sheet.getRange(WRITING_NONFICTION + range);
  var wordCell = sheet.getRange(WRITING_TOTAL + range);
  var avgCell = sheet.getRange(WRITING_AVERAGE + range);
  var goalCell = sheet.getRange(WRITING_GOAL + range);
  var timeCell = sheet.getRange(WRITING_TIME + range);
  var avgCell = sheet.getRange(WRITING_AVERAGE + range);
  var avgStart = range - 6;
  
  
  var words = words_fiction + words_nonfiction;
  
  if (TEST_MODE == 1) {
    Logger.log("TEST MODE: Would set " + WRITING_DATE + range + " to " + today);
    if (MODE == 1) {
      Logger.log("TEST MODE: Would set " + WRITING_FICTION + range + " to " + words_fiction);
      Logger.log("TEST MODE: Would set " + WRITING_NONFICTION + range + " to " + words_nonfiction);
    }
    Logger.log("TEST MODE: Would set " + WRITING_TOTAL + range + " to " + words);    
    Logger.log("TEST MODE: Would set " + WRITING_TIME + range + " to " + time_total);
    Logger.log("TEST MODE: Would set " + WRITING_AVERAGE + range + " to =AVERAGE(" + WRITING_TOTAL + avgStart + ":" + WRITING_TOTAL + range + ")");
    Logger.log("TEST MODE: Would set " + WRITING_GOAL + range + " to " + daily_goal);
  } else {
    dateCell.setValue(today);
    if (MODE == 1) {
      ficWordCell.setValue(words_fiction);
      nfWordCell.setValue(words_nonfiction);
    }
    wordCell.setValue(words);    
    timeCell.setValue(time_total);
    goalCell.setValue(daily_goal);
    avgCell.setFormula("=AVERAGE(" + WRITING_TOTAL + avgStart + ":" + WRITING_TOTAL + range + ")");
  }
    
  if (daily_diff != "") {
    // Send email only if there has been changes or new writing
    var message = "<html><body>";
    var lines = daily_diff.match(/^.*((\r\n|\n|\r)|$)/gm);
    var cur_line = "";
    for (i in lines) {
      cur_line = lines[i];
      cur_line = cur_line.replace(/\r\n|\n|\r/, '');
      message = message + "<p>" + cur_line + "</p>";
    }
    message = message + "</body></html>";
    
    if (EMAIL_ADDRESS != null && EMAIL_ADDRESS != '') {
      /* ASSERT: Email address provided */
      
      /* Process keyword substition for the email subject line */
      subject = EMAIL_SUBJECT;
      subject = replaceAll(subject, "{{FictionWords}}", words_fiction);
      subject = replaceAll(subject, "{{NonfictionWords}}", words_nonfiction);
      subject = replaceAll(subject, "{{WritingDate}}", today);
      subject = replaceAll(subject, "{{TotalWords}}", words);
      subject = replaceAll(subject, "{{GoalWords}}", daily_goal);
    
      // Send the changes <-- Only send if there was writing!
      Logger.log("  -> Sending email");
      if (TEST_MODE == 1)
        Logger.log(subject);
      MailApp.sendEmail(EMAIL_ADDRESS, subject, "", {htmlBody: message});      
    } else {
      /* ASSERT: no email address provided */
      Logger.log('No email address provided so no email is being sent.');
    }
  } else {
    Logger.log("  -> Nothing new so no email send.");
  }
}

function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceAll(string, find, replace) {
  return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}


function getWritingTime(rt_date) {
  var api_format = "json";
  var perspective = "interval";
  var resolution = "hour";
  var kind = "activity";
  var thing = "docs.google.com";
  var thingy = "Google Docs";
  
  var URL = "https://www.rescuetime.com/anapi/data?";
  URL += "key=" + RESCUETIME_TOKEN;
  URL += "&format=" + api_format;
  URL += "&perspective=" + perspective;
  URL += "&rs=" + resolution;
  URL += "&rb=" + rt_date;
  URL += "&rk=" + kind;
  URL += "&rt=" + thing;
  
  var response = UrlFetchApp.fetch(URL).getContentText();
  var dataAll = JSON.parse(response);
  
  if (TEST_MODE == 1) {
    Logger.log(URL);
    Logger.log(dataAll.rows);
  }
  
  var totalSeconds = 0;
  result_rows = dataAll.rows;
  for (i=0; i< result_rows.length; i++) {
    var gDoc = result_rows[i][3];
    if (gDoc.indexOf("Google Docs")>0)
      totalSeconds += result_rows[i][1];
  }
  return totalSeconds/60;
}

function backupFile(id) {
  var folder = DocsList.getFolder(SNAPSHOT_FOLDER);
  var orig = DocsList.getFileById(id);
  Logger.log("  -> Backing up " + orig.getName() + " to " + folder.getName() + "...");
  if (doesFileExistByName(SNAPSHOT_FOLDER, orig.getName())){
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

function getFileDiff(id) {
  var doc = DocumentApp.openById(id);
  var name = doc.getName();
  var doc1 = doc.getText();
  var count = getWordCount(doc1);
  var diff = "";
  
  // Is there a file from which to compare?
  Logger.log("  -> Checking file diff for " + name + "...");
  var folder = DocsList.getFolder(SNAPSHOT_FOLDER);
  if (doesFileExistByName(SNAPSHOT_FOLDER, name)) {
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

function getWritingType(id) {
  var doc = DocumentApp.openById(id);
  var doc_text = doc.getText();
  var search_for = FICTION_TAG;
  var index = -1;
  var result = "";
  
  while(true) {
    index = doc_text.indexOf(search_for, index+1);
    if (index == -1)
      break;
    else {
      var result = "Fiction";
      break;
    }
  }
  
  if (result =="") {
    var search_for = NONFICTION_TAG;
    var index = -1
    while(true) {
      index = doc_text.indexOf(search_for, index+1)
      if (index == -1)
        break;
      else {
        var result = "Nonfiction";
        break;
      }
    }
  }
  
  // For now assume that nothing (old docs) means fiction
  if (result == "")
    result = "Fiction";
      
  return result;
}


function getFileWordCount(id) {
  var doc = DocumentApp.openById(id);
  var name = doc.getName();
  var doc1 = doc.getText();
  var count = getWordCount(doc1);
  if (TEST_MODE == 1)
    Logger.log("Word count for " + name + " is " + count);
  var diff = "";
  
  // Does an earlier version exist?
  var folder = DocsList.getFolder(SNAPSHOT_FOLDER);
  if (doesFileExistByName(SNAPSHOT_FOLDER, name)) {
    var files = folder.getFiles();
    for (f in files) {
      if (files[f].getName() == name)
      {
        var prev_doc = DocumentApp.openById(files[f].getId());
        var doc2 = prev_doc.getText();
        var prev_count = getWordCount(doc2);
        if (TEST_MODE == 1)
          Logger.log("Word count for snapshot of " + name + " is " + prev_count);
        count -= prev_count;
      }
    }
  } else {
    //diff = doc1;
  }
  
  return count;
}

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

function getWritingGoal() {
  var qs_doc = SpreadsheetApp.openById(WRITING_DATA);
  var sheet = qs_doc.getSheetByName(SHEET_GOAL);
  var lastRow = sheet.getLastRow();
  var goal = sheet.getRange("B" + lastRow).getValue();
  return goal;
}