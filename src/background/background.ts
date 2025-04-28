import {
  TabsMap,
  saveTab,
  removeTab,
  setFileItem,
  getTabList,
} from "./tabs/tabs";

let currentTabId = 0;

chrome.tabs
  .query({ active: true, currentWindow: true })
  .then((tabs) => {
    if (!tabs.length) return;
    const tab = tabs[0];
    currentTabId = tab.id;
  })
  .catch(() => {});

// 监听标签页激活事件
chrome.tabs.onActivated.addListener(function (activeInfo) {
  // 获取当前激活的标签页 ID
  const tabId = activeInfo.tabId;
  currentTabId = tabId;
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

// 监听响应头
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
    if (!contentSize) return;
    const tabId = data.tabId;
    const uri = data.url;
    setFileItem(tabId, { uri, contentSize });
  },
  { urls: ["<all_urls>"] },
  ["responseHeaders"]
);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "get_current_page") {
    const tabData = TabsMap.get(currentTabId);
    if (!tabData) return;
    sendResponse({
      tabId: currentTabId,
      list: tabData.list,
      activePage: message.activePage,
    });
  } else if (message.action === "get_other_page") {
    const tabData = Array.from(TabsMap.values()).filter(
      (item) => item.tabId !== currentTabId
    );
    if (!tabData) return;
    sendResponse({
      tabId: message.tabId,
      list: tabData.flatMap((item) => item.list),
      activePage: message.activePage,
    });
  }
  return true;
});
