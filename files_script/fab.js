// if not set, create and apply default value
if (! localStorage.getItem("DashIsOn")) {
  localStorage.setItem("DashIsOn", "true");
  location.reload();
}  

var openSVG = '<path d="M4 8h4v-4h-4v4zm6 12h4v-4h-4v4zm-6 0h4v-4h-4v4zm0-6h4v-4h-4v4zm6 0h4v-4h-4v4zm6-10v4h4v-4h-4zm-6 4h4v-4h-4v4zm6 6h4v-4h-4v4zm0 6h4v-4h-4v4z"/><path d="M0 0h24v24h-24z" fill="none"/>';

var closeSVG = 
  '<path d="M19 6.41l-1.41-1.41-5.59 5.59-5.59-5.59-1.41 1.41 5.59 5.59-5.59 5.59 1.41 1.41 5.59-5.59 5.59 5.59 1.41-1.41-5.59-5.59z"/>' + 
  '<path d="M0 0h24v24h-24z" fill="none"/>';


// using Local Storage

var notStarted = 0;
var isOpen;
if (localStorage.getItem("DashIsOn") == "true") {
  notStarted = 1;
  isOpen = true;
}  
else {
  if (notStarted == 0)
    notStarted = 2;
  else
    notStarted = 3;
  isOpen = false;
}  

// using HTML5 local storage
$("#fab_button").click( function() {
  if (notStarted == 2) {
    localStorage.setItem("DashIsOn", "true");
    location.reload();
  }
  else {
    $("#dashboard").fadeToggle("fast");
    if (isOpen) {
      isOpen = false;
      $("#fab_button_svg").html(openSVG);
      localStorage.setItem("DashIsOn", "false");
    }
    else {
      isOpen = true;
      $("#fab_button_svg").html(closeSVG);    
      localStorage.setItem("DashIsOn", "true");
    }  
  }
});



// COOKIE METHOD (has bugs)
// Altho cookie path is set to 'path=/', some cookies will still have paths, 
// causing multiple duplicate of the same cookie name
// 
// var notStarted = 0;
// var isOpen;
// if (getCookie("DashIsOn") == "true") {
//   notStarted = 1;
//   isOpen = true;
// }  
// else {
//   if (notStarted == 0)
//     notStarted = 2;
//   else
//     notStarted = 3;
//   isOpen = false;
// }  

// $("#fab_button").click( function() {
//   if (notStarted == 2) {
//     updateDashCookie(true);
//     location.reload();
//   }
//   else {
//     $("#dashboard").fadeToggle("fast");
//     if (isOpen) {
//       isOpen = false;
//       $("#fab_button_svg").html(openSVG);    
//       updateDashCookie(isOpen);   
//     }
//     else {
//       isOpen = true;
//       $("#fab_button_svg").html(closeSVG);    
//       updateDashCookie(isOpen);
//     }  
//   }
//   // console.log(getCookie("DashIsOn"));
// });

// function updateDashCookie(isOn) {
//   setCookie("DashIsOn", isOn);  
// }

// function setCookie(cname, cvalue) {
//   document.cookie = cname + "=" + cvalue + "; path=/";
// }

// function setCookie(cname, cvalue, exdays) {
//   var d = new Date();
//   d.setTime(d.getTime() + (exdays*24*60*60*1000));
//   var expires = "expires=" + d.toUTCString();
//   document.cookie = cname + "=" + cvalue + "; " + expires;
// }

// function getCookie(cname) {
//   var name = cname + "=";
//   var ca = document.cookie.split(';');
//   for (var i = 0; i < ca.length; i++) {
//     var c = ca[i];
//     while (c.charAt(0) == ' ') c = c.substring(1);
//     if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
//   }
//   return "";
// }