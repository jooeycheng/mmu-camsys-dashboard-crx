document.getElementById("logo_mid").src = chrome.extension.getURL("icon/icon128.png");

var manifest = chrome.runtime.getManifest();
console.log(manifest.name);
console.log(manifest.version);
// $("#versionNumber").html("BETA " + manifest.version);
// document.getElementById("version").innerHTML += manifest.name + "<br>Version " + manifest.version;

for (var i = 1; i <= 4; i++)
	document.getElementById("steps_img0" + i).src = chrome.extension.getURL("images/img0" + i + ".png");