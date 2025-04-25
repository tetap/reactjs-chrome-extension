import type { IFileInfoDto, ITab } from "./type";

export const TabsMap = new Map<number, ITab>();

export function saveTab(tab: ITab) {
  const tabId = tab.tabId;
  if (!tabId) return console.warn("tabId is not found");
  const getTab = TabsMap.get(tabId);
  if (getTab) {
    return TabsMap.set(
      tabId,
      Object.assign({ list: [], uri: "" }, getTab, tab)
    );
  }
  TabsMap.set(tabId, Object.assign({ list: [], uri: "" }, tab));
}

export function removeTab(tabId: number) {
  TabsMap.delete(tabId);
}

export function setFileItem(tabId: number, file: IFileInfoDto) {
  let tab = TabsMap.get(tabId);
  if (!tab) {
    tab = {
      tabId,
      title: "",
      uri: "",
      list: [],
    };
    saveTab(tab);
  }
  // 查看是否存在
  const index = tab.list.findIndex((item) => item.uri === file.uri);
  if (index !== -1) {
    tab.list[index] = Object.assign(tab.list[index], file);
  } else {
    const now = Date.now();
    tab.list.push({
      uri: file.uri,
      create_at: now,
      update_at: now,
    });
  }
}

export function removeFileItem(tabId: number, uri: string) {
  const tab = TabsMap.get(tabId);
  if (!tab) return;
  tab.list = tab.list.filter((item) => item.uri !== uri);
}
