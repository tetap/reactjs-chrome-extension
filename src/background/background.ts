// 监听网络请求
console.log("chrome.webRequest", chrome.webRequest);
console.log("chrome", chrome);
console.log("background.js loaded");

chrome.webRequest.onCompleted.addListener(
  function (details) {
    console.log("onCompleted", details);
  },
  { urls: ["<all_urls>"] },
  ["responseHeaders"]
);
