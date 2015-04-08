
// GLOBAL Variables  - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// The Hidden Communication Bridge method
var myScript = document.createElement('script'),
    myDiv = document.createElement('div');

myDiv.id = 'hidden-div-bridge';
myDiv.style.display = 'none';
myScript.textContent = "document.getElementById('hidden-div-bridge').textContent = localStorage.getItem('DashIsOn');";

document.body.appendChild(myDiv);
document.head.appendChild(myScript);

checkVariable();

// Check for the value until it's received
function checkVariable() {
    if (myDiv.textContent !== "") {
        goOn(myDiv.textContent);
        // The variable has been found, call the goOn function and do what you want
    } else {
        setTimeout(checkVariable, 100);
        // The variable has not been found yet, check for it later
    }
}

// This function will be called once the variable is extracted from the page
var isDashOn;
function goOn(variable) {
  // do something with the variable you wanted
  if (variable == "false")
    isDashOn = false;
  else
    isDashOn = true;
}


// System Functions - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function setCookie(cname, cvalue) {
  document.cookie = cname + "=" + cvalue + "; path=/";
}

// function setCookie(cname, cvalue, exdays) {
//   var d = new Date();
//   d.setTime(d.getTime() + (exdays*24*60*60*1000));
//   var expires = "expires=" + d.toUTCString();
//   document.cookie = cname + "=" + cvalue + "; " + expires;
// }

function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1);
		if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
	}
	return "";
}

function hasCookie(cname) {
	var cookie = getCookie(cname);
	if (cookie != "")
		return true;
	else
		return false;
}

function getAllCookies() {
	var cookies_arr = document.cookie.split("; ");
	for (i = 0; i < cookies_arr.length; i++) {
		console.log("'" + cookies_arr[i] + "'");
	}
	console.log("total: " + cookies_arr.length);
}

// get URL GET variables
function getParameterByName(name) {
	name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
		results = regex.exec(location.search);
	return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Login Page Functions - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function hasError() {
  var errVisible = $("#login_error").css("visibility");
  if (errVisible == "visible")
    return true;
  return false;
}

var gotError = false;
function showPage_Login() {
  gotError = hasError();
  loadHTMLpage_Login();  
}

function verifyLoginPageURL() {
	// links without rubbish will give registry error
	// sol: redirect to link with rubbish at the end	
	var login_pages = [
		"https://cms.mmu.edu.my/psp/csprd/?cmd=login&languageCd=ENG&",
		"https://cms.mmu.edu.my/psp/csprd/?cmd=login&languageCd=ENG",
		"https://cms.mmu.edu.my/psp/csprd/?&cmd=login&languageCd=ENG",
		"https://cms.mmu.edu.my/psp/csprd/EMPLOYEE/HRMS/?&cmd=login&languageCd=ENG"
	];
	var pageOk = false;
	for (var i = 0; i < login_pages.length; i++) {
		if (document.URL == login_pages[i]) {
			pageOk = true;
			break;
		}
	}
	if (!pageOk)
		window.location.href = "https://cms.mmu.edu.my/psp/csprd/?cmd=login&languageCd=ENG";
}

function isLoggedin() {
	var param_errorCode = getParameterByName('errorCode');
	var param_cmd = getParameterByName('cmd');
	if (hasCookie("ORA_OTD_JROUTE")) {
		// user is logged-in
		if (param_cmd == 'logout') {
			// user just logged-out
			// console.log('Status: Logged Out');
			showPage_Login();
		} else if (param_cmd == 'expire') {
			// connection expired
			// console.log('Status: Connection Expired');
			showPage_Login();
		} else {
			// console.log('Status: Logged In');
			return true;
		}
	} else {
		if (param_errorCode) {
			// errorCode variable exists
			// console.log('Status: Login Error');
			showPage_Login();
		} else {
			// console.log('Status: Login Page');
			verifyLoginPageURL();
			showPage_Login();
		}
	}
	return false;
}

function loadHTMLpage_Login() {
  // ERASE & REPLACE <html>
  var url_newLogin = chrome.extension.getURL("files_html/loginpage.html");
  $.ajax({
    url: url_newLogin,
    dataType: 'text',
    success: function(data) {

      $("html").attr("id", "theWholePage");
      $("#theWholePage").html("");
      var elements = $("body").html(data)[0]; // the miracle line - replaces default html with loaded html

      $("head").append("<title>CaMSys</title>");

      $("<link/>", {
        rel: "shortcut icon",
        type: "text/css",
        href: chrome.extension.getURL("/icon/icon32.png")
      }).appendTo("head");

      $("<script/>", {
        src: chrome.extension.getURL("jquery.min.js")
      }).appendTo("head");

      $("<link/>", {
        rel: "stylesheet",
        type: "text/css",
        href: chrome.extension.getURL("/files_html/font-awesome.min.css")
      }).appendTo("head");

      $("<link/>", {
        rel: "stylesheet",
        type: "text/css",
        href: chrome.extension.getURL("/files_html/loginpage.css")
      }).appendTo("head");

      $("#mmulogo img").attr("src", chrome.extension.getURL("icon/icon128.png"));

      $("body").css("background", "url(" + chrome.extension.getURL("images/paper.jpg") + ")");
      
      var manifest = chrome.runtime.getManifest();
      // console.log(manifest.name);
      // console.log(manifest.version);
      $("#versionNumber").html("" + manifest.version);

      $("<script/>", {
        src: chrome.extension.getURL("/files_script/loginpage.js")
      }).appendTo("body");

      // sometimes, url doesnt show errorCode parameter, need to manual check if got error
      if (! getParameterByName('errorCode') && gotError)
        $("#invaliduserpass").html("Invalid Username or Password");
      
    }
  });
}

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Home Page Functions - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

function loadHTMLpage_Home() {
	// ERASE & REPLACE <html>
	var url_newHome = chrome.extension.getURL("files_html/home.html");
	$.ajax({
		url: url_newHome,
		dataType: 'text',
		success: function(data) {

      showFabButton(false);

			$("html").attr("id", "theWholePage");
      $("body").attr("id", "theWholePageBody");
			// $("#theWholePage").html("");
			// var elements = $("body").html(data)[0]; // the miracle line - replaces default html with loaded html

      $("body").append(data)[0];

      // $('<iframe id="frame_dashboard"/>')
      //   .appendTo('#theWholePageBody')
      //   .contents().find('body').append(data);

      $("head").append("<title>CaMSys</title>");

			$("<link/>", {
			  rel: "shortcut icon",
			  type: "text/css",
			  href: chrome.extension.getURL("/icon/icon32.png")
			}).appendTo("head");

			$("<script/>", {
			  src: chrome.extension.getURL("jquery.min.js")
			}).appendTo("head");

			$("<link/>", {
			  rel: "stylesheet",
			  type: "text/css",
			  href: chrome.extension.getURL("/files_html/font-awesome.min.css")
			}).appendTo("head");

			$("<link/>", {
			  rel: "stylesheet",
			  type: "text/css",
			  href: chrome.extension.getURL("/files_html/home.css")
			}).appendTo("head");

			$("<link/>", {
			  rel: "stylesheet",
			  type: "text/css",
			  href: chrome.extension.getURL("/files_html/print.css"),
			  media: "print"
			}).appendTo("head");

			$("#printHeader img").attr("src", chrome.extension.getURL("icon/icon48.png"));

			$("#loadingOverlay img").attr("src", chrome.extension.getURL("images/loading.gif"));;

      $("<script/>", {
        src: chrome.extension.getURL("/files_script/home.js")
      }).appendTo("body");
		}
	});
}

// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// start scrape functions * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 


var isDisplayed = 0;
function updateLoading(section) {
  switch (section) {
    case "Att":
    case "SC":
    case "Schedule":
      isDisplayed++;
    break;
  }

  if (isDisplayed == 3)
    $("#loadingOverlay").fadeOut("slow"); // Finished loading      
}

function isTitleCaseExcepton(word) {
  var youaretheonlyexception = ["OOPDS","OOAD"];

  for (var i = 0; i < youaretheonlyexception.length; i++)
    if (youaretheonlyexception[i] == word)
      return true;
  
  return false;
}

function toTitleCase(_str) {
  // if word is supposed to be all CAPS, ignore word
  if (isTitleCaseExcepton(_str))
    return _str;

  _str = _str.replace("AND", "&");
  _str = _str.replace("amp;", "");
  _str = _str.replace("II", "2");
  _str = _str.replace("III", "3");
  return _str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

function removeDecimals(stringwithdecimal) {
  return stringwithdecimal.substr(0, stringwithdecimal.length - 4);
}

function addtoAttArray(string_subject) {
  // console.log(string_subject);
  var thestring = string_subject.split("**");

  // for (var i = 0; i < 9; i++) {
  //  console.log(i + "* " + thestring[i]);
  // };

  var myObject = new Object();
  myObject.number = thestring[0];
  myObject.code = thestring[1] + thestring[2];
  myObject.lec_tut = thestring[3];
  myObject.name = thestring[4].replace("AND", "&");
  myObject.current_att = removeDecimals(thestring[5]);
  myObject.barring_att = removeDecimals(thestring[6]);
  myObject.last_updated_by = thestring[7];
  myObject.last_updated_date = thestring[8];

  // console.log("myObject.current_att", myObject.current_att);

  return myObject;
}

function formatAttArray(myObjectArray) {
  var subjects = myObjectArray;
  
  var distinct_subs_name = [];
  var temp_name = subjects[0].name;
  var temp_code = subjects[0].code;
  distinct_subs_name.push(temp_name);

  var array_subs_obj = [];
  
  // INDEX 0
  var sub_obj = new Object();
      sub_obj.name = temp_name;
      sub_obj.code = temp_code;
      sub_obj.att_lec = "";
      sub_obj.att_tut = "";
      array_subs_obj.push(sub_obj);

  // INDEX 1 & ABOVE
  // ADD UNIQUE SUBJECT NAMES TO NEW ARRAY
  for (var i = 1; i < subjects.length; i++) { // Get all unique subjects, add to array
    var temp_name_compare = subjects[i].name;    
    if (temp_name != temp_name_compare) {      
      temp_code = subjects[i].code;
      temp_name = temp_name_compare;
      distinct_subs_name.push(temp_name);

      var sub_obj = new Object();
      sub_obj.name = temp_name;
      sub_obj.code = temp_code;
      sub_obj.att_lec = "";
      sub_obj.att_tut = "";
      array_subs_obj.push(sub_obj);
    }
  }

  // ADD TUT & LEC Att TO ARRAY AS OBJECTS
  for (var i = 0; i < array_subs_obj.length; i++) {

    // console.log("array_subs_obj.name", array_subs_obj[i].name);

    for (var ii = 0; ii < subjects.length; ii++) {
      if (array_subs_obj[i].name == subjects[ii].name) {
        if (subjects[ii].lec_tut == "Lecture") {
          if (array_subs_obj[i].att_lec == "") {
            array_subs_obj[i].att_lec = subjects[ii].current_att;
            // console.log("subjects[ii].name", subjects[ii].name);
            // console.log("lec_att", subjects[ii].current_att);
          }
        }
        else if (subjects[ii].lec_tut == "Tutorial" || subjects[ii].lec_tut == "Laboratory") {
          if (array_subs_obj[i].att_tut == "") {
            array_subs_obj[i].att_tut = subjects[ii].current_att;
            // console.log("subjects[ii].name", subjects[ii].name);
            // console.log("tut_att", subjects[ii].current_att);
          }          
        }
      }
    }
  }

  // DEBUGGING - PRINTING  
  // $.each(array_subs_obj, function(i, el){
  //   console.log(i, el.code, el.name, el.att_tut, el.att_lec);
  // });  

  return array_subs_obj;
}

// STUDENT CENTER * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 

function replaceAll(find, replace, str) {
  return str.replace(new RegExp(find, 'g'), replace);
}

var Max_timeEnd = -1;
function formatScheduleTimeData(right_data_string) {

  var classObjAll = [];
  var numOfObj = right_data_string.length / 2;
  var class_day = class_time_start = class_time_end = class_venue = "";

  // SPLIT STRING DATA INTO (day, time, venue)

  for (var i = 0; i < right_data_string.length; i+=2) {
    class_day = right_data_string[i].substr(0, 2);
    var time = right_data_string[i].substr(3);
    class_venue = right_data_string[i + 1];    
    var separated = class_venue.split("-");

    var elevenOrTwelve = time.substr(0, 3);
    if (elevenOrTwelve == "10:" || elevenOrTwelve == "11:" || elevenOrTwelve == "12:")
      class_time_start = time.substr(0, 7);
    else
      class_time_start = time.substr(0, 6);    

    elevenOrTwelve = time.substr(time.length - 7, 3);    
    if (elevenOrTwelve == "10:" || elevenOrTwelve == "11:" || elevenOrTwelve == "12:")
      class_time_end = time.substr(time.length - 7);
    else
      class_time_end = time.substr(time.length - 6);
    
    var classObj = new Object();
    classObj.day = class_day;
    classObj.timeStart = class_time_start;
    classObj.timeEnd = class_time_end;
    classObj.venueCode = separated[0];
    classObj.venueName = separated[1];

    var class_time_start_24 = convertTo24hrs(class_time_start);
    var class_time_end_24 = convertTo24hrs(class_time_end);

    if (Max_timeEnd < class_time_start_24)
      Max_timeEnd = class_time_start_24;
    if (Max_timeEnd < class_time_end_24)
      Max_timeEnd = class_time_end_24;

    // DEBUGGING    
    if (false) {
      console.log("#function: formatScheduleTimeData");
      console.log("day:", classObj.day);
      console.log("time start:", classObj.timeStart);
      console.log("time end:", classObj.timeEnd);
      console.log("venue:", class_venue);
      console.log("venue code:", classObj.venueCode);
      console.log("venue name:", classObj.venueName);
      console.log("");
    }

    classObjAll.push(classObj);        
  };

  // DEBUGGING
  if (false) {
    $.each(classObjAll, function(i, stuff) {
      // console.log(i, stuff.day, stuff.timeStart, stuff.timeEnd, stuff.venueCode, stuff.venueName);
      console.log(i, stuff);
    });
  }

  return classObjAll;
}

function formatSchedule(dataSchedule) {

  var theSchedule = [];

  // console.log('dataSchedule', dataSchedule);

  $.each(dataSchedule, function(i, el) {

      var subCodeName = $(el).find(".PAGROUPDIVIDER").html(); // Subject code & name
      
        var scheduleObj = new Object();
        scheduleObj.code = subCodeName.substr(0, 1) + subCodeName.substr(2, 6);
        scheduleObj.name = subCodeName.substr(11);

      var temp_subContent = $(el).find(".PSEDITBOX_DISPONLY"); // subject details
      subContent = [];
      $.each(temp_subContent, function(ii, ell) {
        subContent.push($(ell).html());
      });

      // if subject is dropped, ignore subject
      var ignoreThisShit = false;
      if (subContent[0] == "Dropped")
        ignoreThisShit = true;

      var subjectIsEnrolled = false;
      if (subContent[0] == "Enrolled")
        subjectIsEnrolled = true;

      var sectionContent = $(el).find("a.PSHYPERLINK");
      var secA = $(sectionContent[0]).html();
      var secB = $(sectionContent[1]).html();
      
      // console.log('subContent Before', subContent);
      subContent.splice(0, 4); // Remove first 4 elements (Status, Units (Credit Hours), Grading, Grade)
      // console.log('subContent After', subContent);      


      // #BugFix on 20150409
      // 2nd CaMSys Trimester (2015 March) onwards,
      // in Schedule List View,
      // CaMSys removed a column between 'Grading' and 'Deadlines' called 'Grade'
      // this caused 'subContent' array to be one element short, breaking it
      // subContent[1] is now subContent[0]
      // temp fix: (add dummy element to replace missing element)
      subContent.unshift("-");
      // end BugFix


      var indexCut = -2;
      var Lecture;
      var Tutorial;
      var timeArrayLec = [];
      var timeArrayTut = [];
      var lecSection = "";
      var tutSection = "";
      var runLec = false;
      var runTut = false;

      // if subject is like FYP, no class, got nothing, just a damn subject, ignore subject
      if (subContent[1] == "Lecture" || subContent[1] == "Tutorial" || subContent[1] == "Laboratory")
        if (subContent[2] == "&nbsp;")
          ignoreThisShit = true;

      if (! ignoreThisShit && subjectIsEnrolled) {

        if (subContent[1] == "Lecture") {
          if (secA)
            runLec = true;
              scheduleObj.lecSection = secA;
          if (secB)
            runTut = true;              
              scheduleObj.tutSection = secB;
          if (runTut) {
            indexCut = $.inArray("Tutorial", subContent) - 1;
            if (indexCut < 0) 
              indexCut = $.inArray("Laboratory", subContent) - 1;            
              
            Lecture = subContent.slice(0, indexCut);
            Tutorial = subContent.slice(indexCut);
          }            
          else
            Lecture = subContent;
        }
        else if (subContent[1] == "Tutorial" || subContent[1] == "Laboratory") {
          if (secB)
            runLec = true;
              scheduleObj.lecSection = secB;
          if (secA)
            runTut = true;
              scheduleObj.tutSection = secA;
          if (runLec) {
            indexCut = $.inArray("Lecture", subContent) - 1;
            Tutorial = subContent.slice(0, indexCut);
            Lecture = subContent.slice(indexCut);
          }
          else 
            Tutorial = subContent;
        }

        if (runLec) {
          for (var ii = 0; ii < Lecture.length; ii+=5) {
            // Skip index 0 & 1 (Class code & lec_tut)
            timeArrayLec.push(Lecture[2 + ii]);  // index 2 = day + time
            timeArrayLec.push(Lecture[3 + ii]);  // index 3 = venue        
            // Skip index 4 (Start/End date)
          }          
          scheduleObj.lecTime = formatScheduleTimeData(timeArrayLec);
        }

        if (runTut) {
          for (var ii = 0; ii < Tutorial.length; ii+=5) {
            // Skip index 0 & 1 (Class code & lec_tut)
            timeArrayTut.push(Tutorial[2 + ii]);  // index 2 = day + time
            timeArrayTut.push(Tutorial[3 + ii]);  // index 3 = venue
            // Skip index 4 (Start/End date)
          }
          scheduleObj.tutTime = formatScheduleTimeData(timeArrayTut);
        }            

        theSchedule.push(scheduleObj);

      }    
  });

  // properties:
  // code, name, lecTime, lecSection, tutTime, tutSection
  // lecTime & tutTime properties:
  // day, timeStart, timeEnd, class_venue, venueCode, venueName

  // DEBUGGING
  if (false) {
    $.each(theSchedule, function(ii, ell) {
      console.log(ii, ell);
    });
  }    

  return theSchedule;
}

// DISPLAY THE DATA * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 

function circleGreenOrRed(att) {
  if (att < 50)
    return "red";
  else if (att < 80)
    return "orange";
  else
    return "green";
}

function displayAttendance(noErrors, theAttendanceArray) {  
  if (noErrors) {
    $.each(theAttendanceArray, function(i, el) {
      var output = "";
      if (i > 0)
        output += "<hr>";  
      output += "<div class='itemlist'>" +
        "<h3>" + el.code + " - " + el.name + "</h3>" +
        "<div class='itemlist_lectut'>" +
        "<div>" +
          "<h4>Lecture</h4>" +
          "<div class='" + circleGreenOrRed(el.att_lec) + "'><span>" + el.att_lec + "<span>%</span></span></div>" +
        "</div>";

      if (el.att_tut) {
        output += "<div>" +
                    "<h4>Tutorial</h4>" +
                    "<div class='" + circleGreenOrRed(el.att_tut) + "'><span>" + el.att_tut + "<span>%</span></span></div>" +
                  "</div>";
      }

      output += "</div>" + "</div>";

      $("#section_attendance").append(output);
    });
  }
  else {
    var output = 
      "<div class='itemlist'>" +
      "<h3>" + theAttendanceArray + "</h3>" +
      "</div>";
    $("#section_attendance").append(output);
  }  
}

function addScheduleRows(maxEndTime) {
  var max = 1900; // Latest time in schedule - 7pm
  maxEndTime = parseInt(maxEndTime);
  duration = (maxEndTime - max) / 100;
  duration = Math.ceil(duration);
  var time = 6 + duration;
  for (var i = 0; i < duration; i++) {
    $("#theSchedule tr").eq(23 + i * 2).css("display", "");
    $("#theSchedule tr").eq(24 + i + i).css("display", "");
  }
}

function convertTo24hrs(time) {
  var am_pm = time.substr(-2);
  var output = "";

  if (am_pm == "AM" || am_pm == "PM") {
    var firstTwo = time.substr(0, 2);

    // If not 11 or 12, remove ':' symbol
    if (firstTwo != "10" && firstTwo != "11" && firstTwo != "12")
      firstTwo = firstTwo.substr(0, 1);
    
    firstTwo = parseInt(firstTwo);

    if (am_pm == "AM") {
      if (firstTwo == 12)
        output += "00";
      else if (firstTwo < 10)
        output += "0" + firstTwo;
      else
        output += firstTwo;
    } 
    else if (am_pm == "PM") {
      if (firstTwo != 12)
        firstTwo += 12;
      output += firstTwo;
    }

    return output + time.substr(-4, 2);
  }
  else {
    if (time.substr(0, 1) == " ")
      output = time.substr(1, 5);
    else
      output = time.substr(0, 5);

    output = output.substr(0, 2) + output.substr(3, 2);
    return output;
  }  
}

function printTimeToTable(i, el, timeObj, section) {
  // max:
  // x:5 (Mon - Fri), y:11 (8am - 6pm)

  var days = ["Mo", "Tu", "We", "Th", "Fr"]; // Use index as x-axis

  $.each(timeObj, function(ii, ell) {

      var timeStart = parseInt(convertTo24hrs(ell.timeStart));
      var timeEnd = parseInt(convertTo24hrs(ell.timeEnd));

      var duration = 0;
      duration = (timeEnd - timeStart) / 100;
      duration = duration / 0.5;      
      duration = Math.ceil(duration);

      var Min = 0800; // Earliest time in schedule - 8am
      var Max = 1900; // Latest time in schedule - 7pm
      
      var x_index = $.inArray(ell.day, days);
      var y_index = 0;
      
      for (var Q = Min; Q < Max; Q += 30) {

        if (Q % 100 == 60)
          Q += 40;

        if (Q == timeStart) {
          var theIndex = x_index + (y_index * 5);

          // console.log("theIndex", theIndex);
          $("#section_schedule .table_schedule td.day")
              .eq(theIndex)
              .attr("rowspan", duration)
              .addClass("color0" + (i + 1))
              .html(el.code + " - " + section + "<br>@" + ell.venueCode);

          // use this to erase unused <td>
          for (var QQ = 1; QQ < duration; QQ ++) {
            $("#section_schedule .table_schedule td.day")
              .eq(theIndex + (QQ * 5))
              .attr("style", "display:none");              
          }

          // break the loop once done, looping no longer required
          break;
        }
        y_index++;

      }
      
    }); 
}

function displaySchedule(theScheduleArray) {  

  // theScheduleArray properties:
  // code, name, lecTime, lecSection, tutTime, tutSection

  // lecTime & tutTime properties:
  // day, timeStart, timeEnd, class_venue, venueCode, venueName  

  addScheduleRows(Max_timeEnd);

  $.each(theScheduleArray, function(i, el) {
    if (el.lecSection)
      printTimeToTable(i, el, el.lecTime, el.lecSection);
    if (el.tutSection)
      printTimeToTable(i, el, el.tutTime, el.tutSection);

    // // DEBUGGING
    // if (false) {
    //   console.log(i, el.code, el.name);
    //   $.each(el.lecTime, function(ii, ell) {
    //     console.log("\t", ii, ell.lecSection);
    //     console.log("\t", ii, ell);
    //     // console.log("\t\ttimeStart:", convertTo24hrs(ell.timeStart), "\ttimeEnd:", convertTo24hrs(ell.timeEnd));
    //   });
    //   $.each(el.tutTime, function(ii, ell) {
    //     console.log("\t", ii, ell.tutSection);
    //     console.log("\t", ii, ell);
    //     // console.log("\t\ttimeStart:", convertTo24hrs(ell.timeStart), "\ttimeEnd:", convertTo24hrs(ell.timeEnd));
    //   });
    // }
  });

  // Display table footer - the subject code + name
  var firstColumnHeight = Math.round(theScheduleArray.length / 2);
  var theIndex2 = 0;

  $.each(theScheduleArray, function(iii, ell) {
    if (iii >= firstColumnHeight)
      theIndex2 = 1;
    
    $("#section_schedule .table_schedule td.subjects")
      .eq(theIndex2)
      .append('<p class="color0' + (iii + 1) + '">' + ell.code + " - " + toTitleCase(ell.name) + '</p>');
  });
}

function displayAdvisor(theAdvisor) {
  var advisorName = theAdvisor;
  $("#advisorName").html(advisorName);
}

function displayFinance(theFinance) {
  var amountDue = theFinance;
  $("#amountDue").html(amountDue);
}

function displayUsername(theUsername) { 
  // var userId = "XXXXXXXXXX";
  var userId = getCookie("SignOnDefault");
  var userName = toTitleCase(theUsername);
  $("#userId").html(userId);
  $("#userName").html(userName);
}

function displayAcademicDate(trimester) {
  var today = new Date();
  // today  = new Date("Mar 30, 2015"); // testing
  var daysList = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  var monthsList = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var theDate = today.getDate() + " " + monthsList[today.getMonth()] + " " + today.getFullYear() + " (" + daysList[today.getDay()] + ")";  
  $("#theDate").html(trimester + "<br>" + theDate);

  var sem3_2014_2015 = new Date("Mar 30, 2015");
  var startSem  = new Date("Oct 20, 2014");
  if (today >= sem3_2014_2015) // if new sem edi, restart week count
    startSem  = sem3_2014_2015;

  var theWeek = Date.dateDiff('w', startSem, today) + 1; // plus 1 cos need +1 only correct, lol

  // if over 28 Dec, -1 (sem break)  
  if (today > new Date("Dec 28, 2014") && today < new Date("Feb 16, 2015")) {
    theWeek -= 1;
  }

  var semBreak = false;
  var specialCase = "";
  if (today > new Date("Dec 28, 2014") && today < new Date("Jan 05, 2015"))
    specialCase = "<sup>&frac12;</sup> (Break)";
  else if (today > new Date("Feb 01, 2015") && today < new Date("Feb 16, 2015"))
    specialCase = " (Finals)";
  else if (today >= new Date("Feb 16, 2015") && today < new Date("Mar 30, 2015"))
    semBreak = true;

  if (!semBreak)
    $("#theWeek").append("Week " + theWeek + specialCase);
  else
    $("#theWeek").append("Sem Break");
}


// PAGE FUNCTIONS * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 

// datepart: 'y', 'm', 'w', 'd', 'h', 'n', 's'
Date.dateDiff = function(datepart, fromdate, todate) {  
  datepart = datepart.toLowerCase();  
  var diff = todate - fromdate; 
  var divideBy = { w:604800000, 
                   d:86400000, 
                   h:3600000, 
                   n:60000, 
                   s:1000 };  
  
  return Math.floor( diff/divideBy[datepart]);
}


// AJAX STUFF * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 

function ajaxAttendance(theUrl) {
  $.ajax({
    url: theUrl,
    dataType: 'text',
    success: function(data) {
      var elements = $("<body>").html(data)[0];
      var theHTML = elements.innerHTML;
      var found_barred = $(theHTML).find('.SSSMSGINFOTEXT');         
      var found = $(theHTML).find("table").eq(2).find('.PSEDITBOX_DISPONLY');
      var current_trimester = $(found[1]).html();

      if (found_barred.length) { // if financially barred
        displayAttendance(false, $(found_barred).html());
      }
      else {
        var att_array = [];      
        for (var i = 2; i < found.length; i++) { // START FROM 2 to skip first 2 elements (code & trimester)
          var string = "";
          for (var ii = 0; ii < 9; ii++) {
            string += (String($(found[i++]).html()) + "**");
          };
          // console.log(string);
          att_array[att_array.length] = addtoAttArray(string);
          i--;
        };
        var distinct_subs = formatAttArray(att_array);
        // Capitalise each word, unless its supposed to be all caps
        $.each(distinct_subs, function(i, el){        
          el.name = toTitleCase(el.name);
        });

        displayAttendance(true, distinct_subs);
      }
      
      displayAcademicDate(current_trimester);

      // DEBUGGING
      if (false) {
        console.log("CURRENT TRIMESTER:", current_trimester);
        $.each(distinct_subs, function(i, el){
          console.log(i, el.code, el.name, el.att_tut, el.att_lec);
        });
      }

      updateLoading("Att");
    }
  });
}

function ajaxStudentCenter(theUrl) {
  $.ajax({
    url: theUrl,
    dataType: 'text',
    success: function(data) {
      var elements = $("<body>").html(data)[0];
      var theHTML = elements.innerHTML;
      var data_username = $(theHTML).find("table").eq(4).find('.PATRANSACTIONTITLE');      
      var data_finance_debt1 = $(theHTML).find("table").eq(4).find('#SF_PAYMENT_WRK_DESCRLONG');
      var data_finance_debt = $(theHTML).find("table").eq(4).find('#SSF_SS_DERIVED_SSF_MESSAGE_TEXT');
      var data_schedule_class = $(theHTML).find("table").eq(4).find('.PSHYPERLINKDISABLED');
      var data_schedule_time = $(theHTML).find("table").eq(4).find('.PSLONGEDITBOX');
      
      var username = $(data_username).html(); // "JOEY CHENG CHI HAN's Student Center"
      username = username.substr(0, username.length - 17); // "JOEY CHENG CHI HAN"
      displayUsername(username);

      // if (id: no outstanding charges) exists, means amountDue = 0
      if (data_finance_debt1.length == 1)
        displayFinance("0.00");
      else {
        var amountDue = $(data_finance_debt).html(); // "You owe 6,066.72."
        amountDue = amountDue.substr(8); // "6,066.72." - 'remove the you owe'
        amountDue = amountDue.substr(0, amountDue.length - 1); // "6,066.72" - remove fullstop at the end
        displayFinance(amountDue);
      }      

      var advisor = $(data_schedule_class[data_schedule_class.length - 1]).html(); // Advisor
      displayAdvisor(advisor);
      
      var phoneNum = $(data_schedule_time[data_schedule_time.length - 2]).html(); // Phone

      var hseAddress = $(data_schedule_time[data_schedule_time.length - 4]).html(); // Home Address

      updateLoading("SC");   
    }
  });
}

function ajaxSchedule(theUrl) {
  $.ajax({
    url: theUrl,
    dataType: 'text',
    success: function(data) {
      var elements = $("<body>").html(data)[0];
      var theHTML = elements.innerHTML;
      var data_schedule = $(theHTML).find(".PSGROUPBOXWBO");

      data_schedule.splice(0, 1); // Remove 1st element (Schedule Filter Options)

      var theSchedule = formatSchedule(data_schedule);
      displaySchedule(theSchedule);

      updateLoading("Schedule");
    }
  });
}

// end scrape functions * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * 
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *

function showFabButton(showOpenDash) {
  if (showOpenDash) {
    $("title").html("CaMSys");
    $("<link/>", {
      rel: "shortcut icon",
      type: "text/css",
      href: chrome.extension.getURL("/icon/icon32.png")
    }).appendTo("head");   
  }

  $("<script/>", {
    src: chrome.extension.getURL("jquery.min.js")
  }).appendTo("head"); 

  $("<script/>", {
    src: chrome.extension.getURL("/files_script/fab.js")
  }).appendTo("head");  

  $("<link/>", {
    rel: "stylesheet",
    type: "text/css",
    href: chrome.extension.getURL("/files_html/fab.css")
  }).appendTo("head");

  var openSVG = '<path d="M4 8h4v-4h-4v4zm6 12h4v-4h-4v4zm-6 0h4v-4h-4v4zm0-6h4v-4h-4v4zm6 0h4v-4h-4v4zm6-10v4h4v-4h-4zm-6 4h4v-4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"/><path d="M0 0h24v24h-24z" fill="none"/>';

  var closeSVG = 
    '<path d="M19 6.41l-1.41-1.41-5.59 5.59-5.59-5.59-1.41 1.41 5.59 5.59-5.59 5.59 1.41 1.41 5.59-5.59 5.59 5.59 1.41-1.41-5.59-5.59z"/>' + 
    '<path d="M0 0h24v24h-24z" fill="none"/>';

  var fab_HTML = '<a id="fab_button" class="fab"><div id="" class="fab_blue">' + 
    '<svg id="fab_button_svg" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">';

  if (! showOpenDash)
    fab_HTML += closeSVG;
  else
    fab_HTML += openSVG;

  fab_HTML += '</svg></div></a>';
  $('body').append(fab_HTML).fadeIn("slow");
}


// MAIN - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

var url_attendance =
	"https://cms.mmu.edu.my/psc/csprd/EMPLOYEE/HRMS/c/N_SR_STUDENT_RECORDS.N_SR_SS_ATTEND_PCT.GBL?" +
	"PORTALPARAM_PTCNAV=HC_SSS_ATTENDANCE_PERCENT_GBL&" +
	"EOPP.SCNode=HRMS&" +
	"EOPP.SCPortal=EMPLOYEE&" +
	"EOPP.SCName=CO_EMPLOYEE_SELF_SERVICE&" +
	"EOPP.SCPTfname=CO_EMPLOYEE_SELF_SERVICE&" +
	"FolderPath=PORTAL_ROOT_OBJECT.CO_EMPLOYEE_SELF_SERVICE.HCCC_ACADEMIC_RECORDS.HC_SSS_ATTENDANCE_PERCENT_GBL&" +
	"IsFolder=false&" +
	"PortalActualURL=https%3a%2f%2fcms.mmu.edu.my%2fpsc%2fcsprd%2fEMPLOYEE%2fHRMS%2fc%2fN_SR_STUDENT_RECORDS.N_SR_SS_ATTEND_PCT.GBL&" +
	"PortalContentURL=https%3a%2f%2fcms.mmu.edu.my%2fpsc%2fcsprd%2fEMPLOYEE%2fHRMS%2fc%2fN_SR_STUDENT_RECORDS.N_SR_SS_ATTEND_PCT.GBL&" +
	"PortalContentProvider=HRMS&" +
	"PortalCRefLabel=Attendance%20Percentage%20by%20class&" +
	"PortalRegistryName=EMPLOYEE&" +
	"PortalServletURI=https%3a%2f%2fcms.mmu.edu.my%2fpsp%2fcsprd%2f&" +
	"PortalURI=https%3a%2f%2fcms.mmu.edu.my%2fpsc%2fcsprd%2f&" +
	"PortalHostNode=HRMS&" +
	"NoCrumbs=yes&" +
	"PortalKeyStruct=yes";

var url_stdCtr = 
	"https://cms.mmu.edu.my/psc/csprd/EMPLOYEE/HRMS/c/SA_LEARNER_SERVICES.SSS_STUDENT_CENTER.GBL?" + 
	"PORTALPARAM_PTCNAV=HC_SSS_STUDENT_CENTER&" + 
	"EOPP.SCNode=HRMS&" + 
	"EOPP.SCPortal=EMPLOYEE&" + 
	"EOPP.SCName=CO_EMPLOYEE_SELF_SERVICE&" + 
	"EOPP.SCLabel=Self%20Service&" + 
	"EOPP.SCPTfname=CO_EMPLOYEE_SELF_SERVICE&" + 
	"FolderPath=PORTAL_ROOT_OBJECT.CO_EMPLOYEE_SELF_SERVICE.HC_SSS_STUDENT_CENTER&" + 
	"IsFolder=false&" + 
	"PortalActualURL=https%3a%2f%2fcms.mmu.edu.my%2fpsc%2fcsprd%2fEMPLOYEE%2fHRMS%2fc%2fSA_LEARNER_SERVICES.SSS_STUDENT_CENTER.GBL&" + 
	"PortalContentURL=https%3a%2f%2fcms.mmu.edu.my%2fpsc%2fcsprd%2fEMPLOYEE%2fHRMS%2fc%2fSA_LEARNER_SERVICES.SSS_STUDENT_CENTER.GBL&" + 
	"PortalContentProvider=HRMS&" + 
	"PortalCRefLabel=Student%20Center&" + 
	"PortalRegistryName=EMPLOYEE&" + 
	"PortalServletURI=https%3a%2f%2fcms.mmu.edu.my%2fpsp%2fcsprd%2f&" + 
	"PortalURI=https%3a%2f%2fcms.mmu.edu.my%2fpsc%2fcsprd%2f&" + 
	"PortalHostNode=HRMS&" + 
	"NoCrumbs=yes&" + 
	"PortalKeyStruct=yes";

var url_schedule = 
	"https://cms.mmu.edu.my/psc/csprd/EMPLOYEE/HRMS/c/SA_LEARNER_SERVICES.SSR_SSENRL_LIST.GBL?" + 
	"FolderPath=PORTAL_ROOT_OBJECT.CO_EMPLOYEE_SELF_SERVICE.HCCC_ENROLLMENT.HC_SSR_SSENRL_LIST&" + 
	"IsFolder=false&" + 
	"IgnoreParamTempl=FolderPath%2cIsFolder";

function startDashboard() {
  loadHTMLpage_Home();
  ajaxAttendance(url_attendance); 
  ajaxStudentCenter(url_stdCtr);
  ajaxSchedule(url_schedule);
}

if (isLoggedin() && isStudent()) {
  if (isDashOn)
    startDashboard();  
  else
    showFabButton(true);
}

function isStudent() {  
  var _userid = getCookie("SignOnDefault");
  if (_userid != "")
    if (isNaN(_userid))
      return false;
    else
      return true;
  else
    return false;
}