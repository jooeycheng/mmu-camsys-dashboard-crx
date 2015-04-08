document.getElementById("logo_mid").src = chrome.extension.getURL("icon/icon128.png");

var manifest = chrome.runtime.getManifest();
// console.log(manifest.name);
// console.log(manifest.version);
// $("#versionNumber").prepend(manifest.version + " ");
document.getElementById("versionNumber").innerHTML = manifest.version + " " + document.getElementById("versionNumber").innerHTML;
