import { clearWatermark } from "./watermark";

// 监听图标被点击
chrome.action.onClicked.addListener((tab) => {
  console.log(tab.id);
  const tabId = tab.id;
  if (!tabId) return;
  chrome.sidePanel.open({ tabId });
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "call-video-url") {
    const url = request.url;
    if (!url) return sendResponse({ code: 500, res: null, err: "url不存在" });
    clearWatermark
      .run(request)
      .then((res) => {
        sendResponse({ code: 200, res, err: "" });
      })
      .catch((err) => {
        sendResponse({ code: 500, res: null, err: err.message });
      });
  }
  return true;
});
