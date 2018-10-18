chrome.storage.sync.get({
  "ekillVersion": {
    shownChangesFor: "0.0"
  }
}, item => {
  if (chrome.runtime.lastError) {
    console.error(chrome.runtime.lastError);
  } else {
    let ekillVersion = item.ekillVersion;
    let stringVersion = chrome.runtime.getManifest().version.toString();
    let showChanges = ekillVersion.shownChangesFor < stringVersion;

    if (showChanges) {
      chrome.browserAction.setBadgeBackgroundColor({ color: "#000000" });
      chrome.browserAction.setBadgeText({text: "New"});
    }

    chrome.browserAction.onClicked.addListener(tab => {
      if (showChanges) {
        chrome.tabs.create({ url: chrome.extension.getURL("changelog.html") });

        showChanges = false;
        chrome.browserAction.setBadgeText({text: ""});

      } else {
        chrome.tabs.sendMessage(tab.id, {});
      }
    });
  }
});

setInterval(() => {
  chrome.storage.local.get({
    "ekillHitlist": "{}"
  }, item => {
    let ekillHitlist = JSON.parse(item.ekillHitlist)
    for(let host in ekillHitlist){
      for(let path in ekillHitlist[host]){
        chrome.browserAction.setBadgeBackgroundColor({ color: "#000000" });
        chrome.browserAction.setBadgeText({text: ekillHitlist[host][path].length.toString()});
      }
    }
  });
}, 5000);
