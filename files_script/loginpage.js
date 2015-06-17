
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
    }
    return "";
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

function slider_knownissue() {
  $('#slider_knownissue').slideToggle();
}  


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// main - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

$("#userid").val(getCookie("SignOnDefault"));

if (getParameterByName('errorCode') == "105")
  $("#invaliduserpass").html("Invalid Username or Password");
if (getParameterByName('errorCode') == "106")
  $("#invaliduserpass").html("Username & Password Required");
if (getParameterByName('errorCode') == "115")
  $("#invaliduserpass").html("The server is down at this time");
if (getParameterByName('cmd') == "logout")
  $("#invaliduserpass").html("Logout Successful");
if (getParameterByName('cmd') == "expire")
  $("#invaliduserpass").html("Connection Expired - Inactive for 20min");