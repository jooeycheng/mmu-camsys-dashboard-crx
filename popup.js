document.getElementById("logo_mid").src = chrome.extension.getURL("icon/icon48.png");

var manifest = chrome.runtime.getManifest();
console.log(manifest.name);
console.log(manifest.version);
// $("#versionNumber").html("BETA " + manifest.version);
document.getElementById("version").innerHTML += manifest.name + "<br>Version " + manifest.version;