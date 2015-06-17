function logout() {
  document.location.href = "https://cms.mmu.edu.my/psp/csprd/EMPLOYEE/HRMS/?cmd=logout";
}

function convertRoomNumber(i, venueCode) {
  // i: 0=chgToOld, 1=chgToNew
  // 1, FCI CR1002
  // 0, CQCR1002
  
  var part01 = venueCode.substr(0, 2 + i);
  var part02 = venueCode.substr(2 + (i * 2), 2);
  var part03 = venueCode.substr(4 + (i * 2));

  var VenueCode_12 = [
  // Cyberjaya
  ["CQ", "FCI"], 
  ["CL", "FOE"], 
  ["CR", "FOM"], 
  ["CJ", "FCM"],
  ["CN", "MPH"],
  // Melaka
  ["MA", "FBL"],
  ["MB", "FSE"]
  // ["MC", "XXX"],
  // ["ME", "XXX"],
  // ["ML", "FET"],
  // ["MN", "FSE"],
  // ["MR", "XXX"],
  // ["MS", "XXX"],
  // ["MT", "XXX"],
  // ["MU", "XXX"],
  // ["MV", "XXX"],
  ];

  var VenueCode_34 = [
  // Cyberjaya
  ["MX" , "XR"], 
  ["ER" , "DR"]
  // Melaka
  ];

  $.each(VenueCode_12, function(ii, el) {
    if (part01 == el[i]) {
      part01 = el[Math.abs(i - 1)];
      if (!i) part01 += " "; // if isNewCode, add space in front (FCI<space>CR1002)
    }      
  });

  $.each(VenueCode_34, function(ii, el) {
    if (part02 == el[i])
      part02 = el[Math.abs(i - 1)];
  });

  var newNumber = part01 + part02 + part03;

  return newNumber;
}

var isOldRoomNumber = 0;
function toggleRoomNumbering() { //bk01 

  var stuffhtml = $("#theSchedule").find("td.day");
  $.each(stuffhtml, function(i, el) {
    var stuff = $(el).html();
    if (stuff != "&nbsp;") {
      var subCode = stuff.split("<br>")[0];
      var subVenue = stuff.split("<br>")[1].substr(1);
      $("#theSchedule td.day").eq(i).html(subCode + "<br>@" + convertRoomNumber(isOldRoomNumber, subVenue)); // convertRoomNumber(0=new, 1=old)
    }
  });

  if (isOldRoomNumber) {
    $("#toggleRoomNumberingButton").css("color", "white");
    // $("#toggleRoomNumberingButton").attr("title", "Use old venue code");
    isOldRoomNumber = 0;    
  } else {
    $("#toggleRoomNumberingButton").css("color", "#1A237E");
    // $("#toggleRoomNumberingButton").attr("title", "Use new venue code");
    isOldRoomNumber = 1;    
  }
}