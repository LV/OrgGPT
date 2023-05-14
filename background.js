function onPageLoadComplete(tabId, changeInfo, tab) {
  if (tab.url.includes('chat.openai.com') && changeInfo.status === 'complete') {
    browser.tabs.executeScript(tabId, {
      file: 'content-script.js',
    });

    browser.tabs.insertCSS(tabId, {
      file: 'styles.css',
    });
  }
}

browser.tabs.onUpdated.addListener(onPageLoadComplete);

