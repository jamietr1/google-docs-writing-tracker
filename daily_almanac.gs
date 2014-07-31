/* ===================================================================================================================== */

/* User-specific information */

var WRITING_DATA = "[YOUR FILE ID]";  // ID to your writing stats spreadsheet

var TEST_MODE = loadConfigData("Test Mode");
var EMAIL_ADDRESS = loadConfigData("Email Address");
var TIME_ZONE = Session.getTimeZone();

var WRITING_SHEET = loadConfigData("Writing Sheet");
var DATA_SHEET = loadConfigData("Data Sheet");
var RECORD_SHEET = loadConfigData("Record Sheet");
var GOAL_SHEET = loadConfigData("Goal Sheet");
var BLOGGING_SHEET = loadConfigData("Blogging Sheet");

/* Spreadsheet constants */
var RECORD_WRITING_STREAK = loadConfigData("Writing Streak");
var RECORD_BLOGGING_STREAK = loadConfigData("Blogging Streak");
var RECORD_WRITING_WORDS = loadConfigData("Words Record");
var RECORD_BLOGGING_WORDS = loadConfigData("Blogging Record");
var RECORD_WRITING_DATE = loadConfigData("Writing Record Date");
var RECORD_BLOGGING_DATE = loadConfigData("Blogging Record Date");
var RECORD_WRITING_GOAL_STREAK = loadConfigData("Writing Goal Streak");
var RECORD_BLOGGING_GOAL_STREAK = loadConfigData("Blogging Goal Streak");
var COL_WRITING_TOTAL = loadConfigData("Writing Total");
var COL_BLOGGING_TOTAL = loadConfigData("Blogging Total");
var COL_FICTION = loadConfigData("Writing Fiction");
var COL_NONFICTION = loadConfigData("Writing Nonfiction");


/* Execution Parameters */
var MODE = loadConfigData("Word Count Mode");
var REPORT_BLOGGING = loadConfigData("Include Blogging");
                            
var error_count = 0;
var OFFSET_DAYS = loadConfigData("Offset Days");
var USE_TUMBLR = loadConfigData("Use Tumblr");
if (USE_TUMBLR == 1)
  var TUMBLR_EMAIL = loadConfigData("Tumblr Email");

if (TEST_MODE == 1)
  Logger.log("Detected time zone as: " + TIME_ZONE);



/* ===================================================================================================================== */

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

function getAlamancText() {
  if (error_count > 0)
  {
    throw new Error ("Not all required configuration settings have been set. See View->Logs for details.");
  }  
  
  var d = new Date();
  d.setDate(d.getDate()-OFFSET_DAYS);

  var almanac_day = Utilities.formatDate(d, TIME_ZONE, "MM/dd/yyyy");
  var message;
  var tumblr_message;
  
  updateRanges();
  
  /* Get writing goals */
  var ficGoal = getWritingGoal();
  
  /* Get word counts */  
  if (MODE == 1) {
    /* ASSERT: Split into fiction/nonficiton */
    var ficWords = getWordsWritten(almanac_day, "Writing", "fiction");
    var nfWords = getWordsWritten(almanac_day, "Writing", "nonfiction");
    var totalFicNonFicWords = ficWords + nfWords;
    var fictionPercent = (ficWords/totalFicNonFicWords)*100;
    var nonFictionPercent = 100 - fictionPercent;
  } else {
    /* ASSERT: Don't split, just give the totals */
    var ficWords = getWordsWritten(almanac_day, "Writing", "fiction");
    var totalFicNonFicWords = ficWords;
  }  
  
  /* Get writing record and date */
  var ficBest = getMaxRecord("Writing");
  var ficBestDate = getMaxRecordDate("Writing");
  
  if (REPORT_BLOGGING == 1) {
    /* ASSERT: get blogging word count */
    var blogWords = getWordsWritten(almanac_day, "Blogging", "Blogging");
  
    /* Get blogging record and date */
    var blogBest = getMaxRecord("Blogging");
    var blogBestDate = getMaxRecordDate("Blogging");
  } else {
    /* ASSERT: not counting blogging */
    var blogWords = 0;
  }
  
  /* Get total writing days */
  var totalWritingDays = getTotalWritingDays();
  var writingDays = totalWritingDays - getMissedDays();
  
  /* Total words written */
  var totalWords = totalFicNonFicWords + blogWords;
  
  /* Get current writing streak */
  if (TEST_MODE == 1)
    Logger.log("Calling getStreakDays(" + almanac_day + ", Writing, 0)");
  var ficStreak = getStreakDays(almanac_day, "Writing", 0);
  
  /* Get current writing goal streak */
  if (TEST_MODE == 1)
    Logger.log("Calling getStreakDays(" + almanac_day + ", Writing, " + ficGoal + ")");    
  var goalStreak = getStreakDays(almanac_day, "Writing", ficGoal);
  
  /* Get best writing streak */
  var ficBestStreak = getMaxRecordStreak("Writing", 0);
  
  /* Get beste writing goal streak */
  var goalBestStreak = getMaxRecordStreak("Writing", 1);
  
  if (REPORT_BLOGGING == 1) {
    /* ASSERT: Get blogging streak */
    if (TEST_MODE == 1)
      Logger.log("Calling getStreakDays(" + almanac_day + ", Bloggingg, 0)");
    var blogStreak = getStreakDays(almanac_day, "Blogging", 0);
  
    /* Get best blogging streak */
    var blogBestStreak = getMaxRecordStreak("Blogging", 0);
  }
  
  message = "<h2>Writing summary</h2>";
  message = message + "<p>You wrote a total of <strong>" + totalWords + "</strong> words. These breakdown as follows:</p>";
  message = message + "<h3>Fiction/Nonfiction</h3>";
  message = message + "<ul><li>Current daily writing goal: " + ficGoal + " words";
  message = message + "<li>You wrote a total of <strong>" + totalFicNonFicWords + "</strong> words:";
  if (MODE == 1) {
    message = message + "<ul><li>Fiction: " + ficWords + " words (" + fictionPercent.toFixed(1) + "%)";
    message = message + "<li>Nonfiction: " + nfWords + " words (" + nonFictionPercent.toFixed(1) + "%)</li></ul>";
  }
  
  // Tumblr message:
  if (USE_TUMBLR == 1) {
    tumblr_message = "<p>Fiction/nonfiction</p>";
    tumblr_message = tumblr_message + "<ul><li>Daily goal: " + ficGoal + " words</li>";
    tumblr_message = tumblr_message + "<li>Fiction words: " + ficWords;
    tumblr_message = tumblr_message + "<li>Nonfiction words: " + nfWords;
  }
  
  if (totalFicNonFicWords > ficBest) {
    message = message + "<ul><li><font color=\"red\">That is a new 1-day record!</font> (It breaks the previous record of " + ficBest + " words back on " + ficBestDate + ".)</li></ul>";
    if (USE_TUMBLR == 1)
      tumblr_message = tumblr_message + "<ul><li><font color=\"red\">New 1-day record!</li></ul>";
    
    // Update the record here
    if (TEST_MODE == 1)
      Logger.log("Would update the writing record to " + totalFicNonFicWords);
    else
      updateRecord("Writing", totalFicNonFicWords, almanac_day);
  }
  
  message = message + "<li>You have now written for " + writingDays + " out of the last " + totalWritingDays + " days.";
  if (USE_TUMBLR == 1)
    tumblr_message = tumblr_message + "</li><li>Have written " + writingDays + " out of " + totalWritingDays + " days</li>";
  
  message = message + "</li>";
  
  if (totalFicNonFicWords == ficBest) {
    message = message + "<li>That ties the 1-day record set back on " + ficBestDate + ".</li>";
  }
  
  if (ficStreak > 0) {
    message = message + "<li>You have now written for " + ficStreak + " consecutive days.";
    if (USE_TUMBLR == 1)
      tumblr_message = tumblr_message + "<li>Consecutive days: " + ficStreak;
    
    if (ficStreak >= ficBestStreak) {
      message = message + "<ul><li><font color=\"red\">That is a new consecutive-day record!</font></li></ul>";
      if (USE_TUMBLR == 1)
        tumblr_message = tumblr_message + "<ul><li><font color=\"red\">New consecutive-day record!</font></li></ul>";
      
      if (TEST_MODE == 1)
        Logger.log("Would update consecutive day streak to " + ficStreak + " days.");
      else
        updateStreak("Writing", ficStreak, 0);
    }
    message = message + "</li>";
    if (USE_TUMBLR == 1)
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
        updateRecord("Blogging", blogWords, almanac_day);
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
    var subject = "(TEST) Daily Almanac for " + almanac_day + " @timeline";
  else 
    var subject = "Daily Almanac for " + almanac_day + " @timeline";
  
  var tumblr_sub = "Daily Writing Almanac for " + almanac_day;
  MailApp.sendEmail(EMAIL_ADDRESS, subject, "", {htmlBody: message});
  
  if (TEST_MODE == 0 && USE_TUMBLR == 1)
    MailApp.sendEmail(TUMBLR_EMAIL, tumblr_sub, "", {htmlBody: message});
  
  if (TEST_MODE == 1)  
    Logger.log(message);
}

function recalculateGoal(date) {
  var prevMonth = firstDayInPreviousMonth(date);
  prevMonth = Utilities.formatDate(prevMonth, TIME_ZONE, "MM/dd/yyyy");
  
}

function getTotalWritingDays() {
  var qs_doc = SpreadsheetApp.openById(WRITING_DATA);
  var qs_sheet = qs_doc.getSheetByName(DATA_SHEET);
  var result = qs_sheet.getRange(RECORD_BLOGGING_DATE).getValue();
  return result;
}

function getMissedDays() {
  var qs_doc = SpreadsheetApp.openById(WRITING_DATA);
  var qs_sheet = qs_doc.getSheetByName(DATA_SHEET);
  var result = qs_sheet.getRange("B1").getValue();
  return result;
}


function updateRecord(type, value, date) {
  var qs_doc = SpreadsheetApp.openById(WRITING_DATA);
  var qs_sheet = qs_doc.getSheetByName(RECORD_SHEET);
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
  var qs_doc = SpreadsheetApp.openById(WRITING_DATA);
  var qs_sheet = qs_doc.getSheetByName(RECORD_SHEET);
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
  if (TEST_MODE == 1)
    Logger.log("getStreakDays called: date=" + date + ", type=" + type + ", goal=" + goal);
  
  var qs_doc = SpreadsheetApp.openById(WRITING_DATA);
  var sheet = qs_doc.getSheetByName(type);

  if (type == "Writing")
    var cur_column = COL_WRITING_TOTAL;
  else
    var cur_column = COL_BLOGGING_TOTAL;
      
  
  var streak = 0;
  
  var range = sheet.getRange("A2:A" + sheet.getLastRow());
  var match = findDate(date, range);
  if (match == null)
    var row = sheet.getRange("A" + sheet.getLastRow() + ":A" + sheet.getLastRow()).getRow();
  else
    var row = match.getRow();
  
  if (sheet.getRange(cur_column + row).getValue() > 0) {
    /* ASSERT: almanac_day wasn't 0 so work backwards */
    for (r = row; r>1; r--) {
      var words = sheet.getRange(cur_column + r).getValue();
      if (words > goal) {
        streak++;
      } else {
        break;
      }

    }  
  }

    return streak;

}

function getWritingGoal() {
  var qs_doc = SpreadsheetApp.openById(WRITING_DATA);
  var sheet = qs_doc.getSheetByName(GOAL_SHEET);
  var lastRow = sheet.getLastRow();
  var goal = sheet.getRange("B" + lastRow).getValue();
  return goal;
}

function getWordsWritten(date, type, wordType) {
  var qs_doc = SpreadsheetApp.openById(WRITING_DATA);
  var sheet = qs_doc.getSheetByName(type);
  var words = 0;
  
  var range = sheet.getRange("A2:A" + sheet.getLastRow());
  var match = findDate(date, range);
  Logger.log(match);
  
  if (wordType == "fiction" || wordType == "Blogging") {  
    try {
      words = sheet.getRange(COL_FICTION + match.getRow()).getValue();
    } catch (e) {
      words = 0; 
    }
  } else {
    try {
      words = sheet.getRange(COL_NONFICTION + match.getRow()).getValue();
    } catch (e) {
      words = 0;
    }
  }
  return words;
}



function findDate(value, range) {
  var data = range.getValues();
  for (var i = 0; i < data.length; i++) {
    for (var j = 0; j < data[i].length; j++) {
      //var curDate = stringifyDate(data[i][j]);
      var curDate = Utilities.formatDate(data[i][j], TIME_ZONE, "MM/dd/yyyy");  
      Logger.log(curDate + " <-> " + data[i][j]);
      if (curDate == value) {
        return range.getCell(i + 1, j + 1);
      }
    }
  }
  return null;
}


function getNamedRangeCellValue(strRangeName)
{
  var ss = SpreadsheetApp.openById(WRITING_DATA);
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
  var qs_doc = SpreadsheetApp.openById(WRITING_DATA);
  var qs_sheet = qs_doc.getSheetByName(WRITING_SHEET);
  
  var lastRow = qs_sheet.getLastRow();
  
  //if (MODE == 1)
  var range = qs_sheet.getRange(COL_WRITING_TOTAL + "2:" + COL_WRITING_TOTAL + lastRow);
  //else
  //  var range = qs_sheet.getRange("B2:B" + lastRow);
  
  qs_doc.setNamedRange("WordCounts", range);
}