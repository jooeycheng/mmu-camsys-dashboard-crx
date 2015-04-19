
// When the extension is installed or upgraded ...
chrome.runtime.onInstalled.addListener(function() {
  // Replace all rules ...
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    // With a new rule ...
    chrome.declarativeContent.onPageChanged.addRules([
      {
        // That fires when a page's URL contains ...
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostEquals: 'cms.mmu.edu.my' },
          })
        ],
        // And shows the extension's page action.
        actions: [ new chrome.declarativeContent.ShowPageAction() ]
      }
    ]);
  });
});


// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// show runOnce page - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -


checkUpdated();
// clearAllVar();

function checkUpdated() {
  var manifest = chrome.runtime.getManifest();
  
  chrome.storage.local.get( function(result) {
    // if 'result.savedVersion' exists
    if (result.savedVersion) {
      if (result.savedVersion == manifest.version)
        console.log("versions equal");
      else
        showChangelog(); // if true - version updated, else - same version
    }      
    else {
      showFirstRun(); // just installed
      chrome.storage.local.set({'savedVersion': manifest.version}, function() {    
        // console.log('created savedVersion');
      });
    }      
  });
}

function showChangelog() {
  // temp disabled, can be annoying
  // only enable if major update & users need to be informed of update

  // seems to be a bug, supposed to show only once, but shows on each update check
  // need to confirm this bug, and fix
  // window.open(chrome.extension.getURL("files_html/updated.html"));
}

function showFirstRun() {
  window.open(chrome.extension.getURL("files_html/firstRun.html"));
}

function clearAllVar() {
  chrome.storage.sync.clear(function() {
    console.log("Nuked All sync storage");
  });
  chrome.storage.local.clear(function() {
    console.log("Nuked All local storage");
  });
}