/* ========================================================================================== */

/* User-specific information */

var QS_WRITING = "ENTER YOUR SPREADSHEET ID";  // ID to your writing stats spreadsheet
var EVERNOTE_EMAIL = "YOU@YOU.COM";            // can be any email address, but I use my EN 
										       //address to automatically send my summaries to 
										       // Evernote.

/* Spreadsheet constants */

var RECORD_WRITING_GOAL_STREAK = "E3";
var RECORD_WRITING_STREAK = "D3";
var RECORD_BLOGGING_STREAK = "D2";
var RECORD_WRITING_WORDS = "C3";
var RECORD_BLOGGING_WORDS = "C2";
var RECORD_WRITING_DATE = "B3";
var RECORD_BLOGGING_DATE = "B2";

/* Execution Parameters */

var VERSION = 1             // SET to 1
var REPORT_BLOGGING = 0;    // SET to 1 if you want blog word counts reported. This assumes they 
							//     are being tracked on your spreadsheet already. DEFAULT is 0
var TEST_MODE = 1;          // SET to 1 to run in test most. Sends email but does not make 	
							//     changes to spreadsheet. Set to 0 when you are satisfied with
							//     the messages.

/* ========================================================================================== */

function getAlamancText() {
  var d = new Date();
  d.setDate(d.getDate()-1);
  var day = d.getDate();
  var yesterday = Utilities.formatDate(d, "EDT", "MM/dd/yyyy");
  var message;
  var tumblr_message;
  
  updateRanges();
  
  if (day == 1) {
    // ASSERT: recalculate goal
    //recalculateGoal(yesterday);
  }
  
  
  Logger.log("Date: " + yesterday);
  // Get writing goal
  var ficGoal = getWritingGoal();
  
  // Get fiction/nonfiction word count
  
  if (VERSION == 2) {
    var ficWords = getWordsWritten(yesterday, "Writing", "fiction");
    var nfWords = getWordsWritten(yesterday, "Writing", "nonfiction");
    var totalFicNonFicWords = ficWords + nfWords;
    var fictionPercent = (ficWords/totalFicNonFicWords)*100;
    var nonFictionPercent = 100 - fictionPercent;
  } else {
    var ficWords = getWordsWritten(yesterday, "Writing", "fiction");
    var totalFicNonFicWords = ficWords;
  }  
  
  // Get best word count
  var ficBest = getMaxRecord("Writing");
  var ficBestDate = getMaxRecordDate("Writing");
  
  if (REPORT_BLOGGING == 1) {
    // Get blogging word count
    var blogWords = getWordsWritten(yesterday, "Blogging", "Blogging");
  
    // Get best blogging word count
    var blogBest = getMaxRecord("Blogging");
    var blogBestDate = getMaxRecordDate("Blogging");
  }
  
  // Get total writing days
  var totalWritingDays = getTotalWritingDays();
  var writingDays = totalWritingDays - getMissedDays();
  
  
  var totalWords = totalFicNonFicWords + blogWords;
  
  // Get writing streak
  Logger.log("Calling getStreakDays: yesterday = " + yesterday);
  var ficStreak = getStreakDays(yesterday, "Writing", 0);
  
  // Get writing goal streak
  var goalStreak = getStreakDays(yesterday, "Writing", ficGoal);
  
  // Get best writing streak
  var ficBestStreak = getMaxRecordStreak("Writing", 0);
  
  // Get best writing goal streak
  var goalBestStreak = getMaxRecordStreak("Writing", 1);
  
  if (REPORT_BLOGGING == 1) {
    // Get blogging streak
    var blogStreak = getStreakDays(yesterday, "Blogging", 0);
  
    // Get best blogging streak
    var blogBestStreak = getMaxRecordStreak("Blogging", 0);
  }
  
  message = "<h2>Writing summary</h2>";
  message = message + "<p>You wrote a total of <strong>" + totalWords + "</strong> words. These breakdown as follows:</p>";
  message = message + "<h3>Fiction/Nonfiction</h3>";
  message = message + "<ul><li>Current daily writing goal: " + ficGoal + " words";
  message = message + "<li>You wrote a total of <strong>" + totalFicNonFicWords + "</strong> words:";
  if (VERSION == 2) {
    message = message + "<ul><li>Fiction: " + ficWords + " words (" + fictionPercent.toFixed(1) + "%)";
    message = message + "<li>Nonfiction: " + nfWords + " words (" + nonFictionPercent.toFixed(1) + "%)</li></ul>";
  }
  
  // Tumblr message:
  
  tumblr_message = "<p>Fiction/nonfiction</p>";
  tumblr_message = tumblr_message + "<ul><li>Daily goal: " + ficGoal + " words</li>";
  tumblr_message = tumblr_message + "<li>Fiction words: " + ficWords;
  tumblr_message = tumblr_message + "<li>Nonfiction words: " + nfWords;
  
  if (totalFicNonFicWords > ficBest) {
    message = message + "<ul><li><font color=\"red\">That is a new 1-day record!</font> (It breaks the previous record of " + ficBest + " words back on " + ficBestDate + ".)</li></ul>";    
    tumblr_message = tumblr_message + "<ul><li><font color=\"red\">New 1-day record!</li></ul>";
    // Update the record here
    if (TEST_MODE == 1)
      Logger.log("Would update the writing record to " + totalFicNonFicWords);
    else
      updateRecord("Writing", totalFicNonFicWords, yesterday);
  }
  message = message + "<li>You have now written for " + writingDays + " out of the last " + totalWritingDays + " days.";
  tumblr_message = tumblr_message + "</li><li>Have written " + writingDays + " out of " + totalWritingDays + " days</li>";
  message = message + "</li>";
  
  if (totalFicNonFicWords == ficBest) {
    message = message + "<li>That ties the 1-day record set back on " + ficBestDate + ".</li>";
  }
  
  if (ficStreak > 0) {
    message = message + "<li>You have now written for " + ficStreak + " consecutive days.";
    tumblr_message = tumblr_message + "<li>Consecutive days: " + ficStreak;
    if (ficStreak >= ficBestStreak) {
      message = message + "<ul><li><font color=\"red\">That is a new consecutive-day record!</font></li></ul>";
      tumblr_message = tumblr_message + "<ul><li><font color=\"red\">New consecutive-day record!</font></li></ul>";
      if (TEST_MODE == 1)
        Logger.log("Would update consecutive day streak to " + ficStreak + " days.");
      else
        updateStreak("Writing", ficStreak, 0);
    }
    message = message + "</li>";
    tumblr_message = tumblr_message + "</li>";
  }
  
  if (totalFicNonFicWords == ficGoal) {
    // ASSERT: made your goal
    message = message + "<li>You achieved your daily writing goal of " + ficGoal + " words.</li>";
    message = message + "<li>You've hit your goal for " + goalStreak + " consecutive days.";
    if (goalStreak > goalBestStreak) {
      message = message + "<ul><li><font color=\"red\">That is a new consecutive-day record for meeting your goal!</font></li></ul>";
      if (TEST_MODE == 1)
        Logger.log("Would update consecutive day goal streak to " + goalStreak + " days");
      else
        updateStreak("Writing", goalStreak, 1);
    }
    message = message + "</li>";
  } else if (totalFicNonFicWords > ficGoal) {
    // ASSERT: exceeded your goal
    var wordsOver = totalFicNonFicWords - ficGoal;
    message = message + "<li>You exceeded your daily writing goal of " + ficGoal + " words by " + wordsOver + " words.</font></li>";
    message = message + "<li>You've hit your goal for " + goalStreak + " consecutive days.";
    if (goalStreak > goalBestStreak) {
      message = message + "<ul><li><font color=\"red\">That is a new consecutive-day record for meeting your goal!</font></li></ul>";  
      if (TEST_MODE == 1)
        Logger.log("Would upate consecutive day goal strek to " + goalStreak + " days");
      else
        updateStreak("Writing", goalStreak, 1);
    }
    message = message + "</li>";
  } else {
    // ASSERT: did not make your goal 
  }
  
  message = message + "</ul>";
  
  if (REPORT_BLOGGING == 1) {
    message = message + "<h3>Blogging</h3>";
    message = message + "<ul><li>You wrote: " + blogWords + " words</li>";
  
    if (blogWords > blogBest) {
      message = message + "<ul><li><font color=\"red\">That is a new 1-day record!</font> (It breaks the previous record of " + blogBest + " words back on " + blogBestDate + ".)</li></ul>";
      // Update the record here
      if (TEST_MODE == 1)
        Logger.log("Would update blogging best to " + blogWords + " words");
      else
        updateRecord("Blogging", blogWords, yesterday);
    }
  
    if (blogWords == blogBest) {
      message = message + "<ul><li>That ties the 1-day record set back on " + blogBestDate + ".</li></ul>";
    }
    
    if (blogStreak > 0) {
      message = message + "<li>You have now blogged for " + blogStreak + " consecutive days.</li>";
      if (blogStreak > blogBestStreak) {
        message = message + "<ul><li>That is a new consecutive-day record!</font></li></ul>";
        if (TEST_MODE == 1)
          Logger.log("Would update consecutive blogging streak to " + blogStreak + " days");
        else
          updateStreak("Blogging", blogStreak, 0);
      }
    }
  
    message = message + "</ul>";
  }
  
  // Send the message
  if (TEST_MODE == 1)
    var subject = "(TEST) Daily Almanac for " + yesterday + " @timeline";
  else 
    var subject = "Daily Almanac for " + yesterday + " @timeline";
  
  var tumblr_sub = "Daily Writing Almanac for " + yesterday;
  MailApp.sendEmail(EVERNOTE_EMAIL, subject, "", {htmlBody: message});
    
  if (TEST_MODE == 1)  
    Logger.log(message);
}

function recalculateGoal(date) {
  var prevMonth = firstDayInPreviousMonth(date);
  prevMonth = Utilities.formatDate(prevMonth, "EDT", "MM/dd/yyyy");
  
}

function getTotalWritingDays() {
  var qs_doc = SpreadsheetApp.openById(QS_WRITING);
  var qs_sheet = qs_doc.getSheetByName("Data");
  var result = qs_sheet.getRange(RECORD_BLOGGING_DATE).getValue();
  return result;
}

function getMissedDays() {
  var qs_doc = SpreadsheetApp.openById(QS_WRITING);
  var qs_sheet = qs_doc.getSheetByName("Data");
  var result = qs_sheet.getRange("B1").getValue();
  return result;
}


function updateRecord(type, value, date) {
  var qs_doc = SpreadsheetApp.openById(QS_WRITING);
  var qs_sheet = qs_doc.getSheetByName("Records");
  var range
  if (type == "Blogging") {
    range = qs_sheet.getRange(RECORD_BLOGGING_WORDS);
    range.setValue(value);
    range = qs_sheet.getRange(RECORD_BLOGGING_DATE);
    range.setValue(date);
    
  } else {
    range = qs_sheet.getRange(RECORD_WRITING_WORDS);
    range.setValue(value);
    range = qs_sheet.getRange(RECORD_WRITING_DATE);
    range.setValue(date);
  }   
}

function updateStreak(type, value, goal) {
  var qs_doc = SpreadsheetApp.openById(QS_WRITING);
  var qs_sheet = qs_doc.getSheetByName("Records");
  var range
  if (type == "Blogging") {
    range = qs_sheet.getRange(RECORD_BLOGGING_STREAK);
    range.setValue(value);
    
  } else {
    if (goal == 1) {
      range = qs_sheet.getRange(RECORD_WRITING_GOAL_STREAK);
    } else {
      range = qs_sheet.getRange(RECORD_WRITING_STREAK);
    }
    range.setValue(value);
  }  
}

function getStreakDays(date, type, goal) {
  Logger.log("Calling getStreakDays for date " + date + ", Goal = " + goal);
  var qs_doc = SpreadsheetApp.openById(QS_WRITING);
  var sheet = qs_doc.getSheetByName(type);
  var streak = 0;
  
  var range = sheet.getRange("A2:A" + sheet.getLastRow());
  var match = findDate(date, range);
  
  var row = match.getRow();
  if (sheet.getRange("D" + row).getValue() > 0) {
    // ASSERT: yesterday wasn't 0 so work backwards
    for (r = row; r>1; r--) {
      var words = sheet.getRange("D" + r).getValue();
      if (words > goal) {
        streak++;
      } else {
        break;
      }

    }  
  }
  Logger.log("Streak: " + streak);
  return streak;
}

function getWritingGoal() {
  var qs_doc = SpreadsheetApp.openById(QS_WRITING);
  var sheet = qs_doc.getSheetByName("Goal");
  var lastRow = sheet.getLastRow();
  var goal = sheet.getRange("B" + lastRow).getValue();
  return goal;
}

function getWordsWritten(date, type, wordType) {
  var qs_doc = SpreadsheetApp.openById(QS_WRITING);
  var sheet = qs_doc.getSheetByName(type);
  var words = 0;
  
  Logger.log("Last row: " + sheet.getLastRow());
  
  var range = sheet.getRange("A2:A" + sheet.getLastRow());
  Logger.log("About to search for: " + date);
  var match = findDate(date, range);
  
  if (wordType == "fiction" || wordType == "Blogging") {  
    try {
      words = sheet.getRange("B" + match.getRow()).getValue();
    } catch (e) {
      words = 0; 
    }
  } else {
    try {
      words = sheet.getRange("C" + match.getRow()).getValue();
    } catch (e) {
      words = 0;
    }
  }
  
  
  return words;
}


function findDate(value, range) {
  var data = range.getValues();
  
  Logger.log("Inside findDate looking for: " + value);
  Logger.log("Last data record: " + data.length);
  
  for (var i = 0; i < data.length; i++) {
    for (var j = 0; j < data[i].length; j++) {
      Logger.log("Raw data[" + i + "][" + j + "]: " + data[i][j]);
      var curDate = Utilities.formatDate(data[i][j], "EDT", "MM/dd/yyyy");
      if (curDate == value) {
        Logger.log("Founding matching date");
        return range.getCell(i + 1, j + 1);
      }
    }
  }
  return null;
}


function getNamedRangeCellValue(strRangeName)
{
  var ss = SpreadsheetApp.openById(QS_WRITING);
  if (ss.getRangeByName(strRangeName) != null)
    return ss.getRangeByName(strRangeName).getValues()[0];
  else
    return null;
}

function getMaxRecord(type) {
  return getNamedRangeCellValue("Record" + type + "Words");
}

function getMaxRecordDate(type) {
  return getNamedRangeCellValue("Record" + type + "Date");
}

function getMaxRecordStreak(type, goal) {
  if (goal != 1)
    return getNamedRangeCellValue("Record" + type + "Streak");
  else
    return getNamedRangeCellValue("Record" + type + "GoalStreak");
}


function DateDiff(date1, date2) {
  return date1.getTime() - date2.getTime();
}


function updateRanges() {
  var qs_doc = SpreadsheetApp.openById(QS_WRITING);
  var qs_sheet = qs_doc.getSheetByName("Writing");
  
  var lastRow = qs_sheet.getLastRow();
  
  if (VERSION == 2)
    var range = qs_sheet.getRange("D2:D" + lastRow);
  else
    var range = qs_sheet.getRange("B2:B" + lastRow);
  
  qs_doc.setNamedRange("WordCounts", range);
}