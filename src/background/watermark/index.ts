import { kuaishou } from "./module/kuaishou";
import { cc } from "./module/cc";

export const clearWatermark = {
  run: async (request) => {
    const url = request.url;
    if (!url) throw new Error("url不存在");
    if (url.startsWith("https://www.kuaishou.com/short-video/")) {
      return kuaishou.getVideoUrl(url, request);
    }
    if (url.startsWith("https://cc.oceanengine.com/")) {
      return cc.getVideoUrl(url, request);
    }
    throw new Error("不支持的url");
  },
};
