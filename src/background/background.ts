import {
  TabsMap,
  saveTab,
  removeTab,
  setFileItem,
  removeFileItem,
} from "./tabs/tabs";

// setInterval(() => {
//   console.log(TabsMap);
// }, 1000);

// 监听标签页激活事件
chrome.tabs.onActivated.addListener(function (activeInfo) {
  // 获取当前激活的标签页 ID
  const tabId = activeInfo.tabId;
  // 获取当前激活的标签页信息
  chrome.tabs.get(tabId, function (tab) {
    saveTab({
      tabId,
      title: tab.title ?? "",
      uri: tab.url ?? "",
    });
  });
});

// 监听标签页更新事件，用于处理标签页 URL 变化等情况
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
  console.log(changeInfo.status);
  if (changeInfo.status === "complete") {
    saveTab({
      tabId,
      title: tab.title ?? "",
      uri: tab.url ?? "",
    });
  }
});

// 监听标签页关闭
chrome.tabs.onRemoved.addListener(function (tabId) {
  removeTab(tabId);
});

// 监听图标被点击
chrome.action.onClicked.addListener((tab) => {
  const tabId = tab.id;
  if (!tabId) return;
  chrome.sidePanel.open({ tabId });
});

chrome.webNavigation.onBeforeNavigate.addListener(function () {
  return;
});

chrome.webNavigation.onHistoryStateUpdated.addListener(function () {
  return;
});

chrome.webRequest.onResponseStarted.addListener(
  async function (data) {
    if (data.frameId === -1) return;
    const responseHeaders = data.responseHeaders;
    let isVideo = responseHeaders.find((item) => {
      if (item.name.toLocaleUpperCase() === "CONTENT-TYPE") {
        return item.value?.includes("video");
      }
      return false;
    });
    if (!isVideo) return;
    const contentSize = (await fetch(data.url, { method: "HEAD" })).headers.get(
      "content-length"
    );
    const tabId = data.tabId;
    const uri = data.url;
    setFileItem(tabId, { uri, contentSize });
  },
  { urls: ["<all_urls>"] },
  ["responseHeaders"]
);

// 删除失败的requestHeadersData
chrome.webRequest.onErrorOccurred.addListener(
  function (data) {
    const tabId = data.tabId;
    const uri = data.url;
    removeFileItem(tabId, uri);
  },
  { urls: ["<all_urls>"] }
);
