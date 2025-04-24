/**
 * 巨量平台
 */

import { CRC32 } from "../util/crc32";

export const cc = {
  getVideoUrl: async (url: string, request: any) => {
    const videoId = request.vid;
    if (!videoId) throw new Error("videoId不存在");
    const basic = "https://ib.365yg.com";
    const path = `/video/urls/v/1/toutiao/mp4/${videoId}?r=${Math.floor(
      Date.now() * 0.01
    )}`;
    // crc32计算path
    const s = CRC32(path);
    const res = await fetch(`${basic}${path}&s=${s}`, {
      method: "GET",
    });
    const data = await res.json();
    const videoList = data.data.video_list;
    if (!videoList) throw new Error("videoList不存在");
    // 获取数值最大的key
    const videoListKey = Object.keys(videoList).sort();
    const lastKey = videoListKey[videoListKey.length - 1];
    console.log("lastKey", lastKey);
    const base64Url = videoList[lastKey].main_url;
    const videoUrl = atob(base64Url);
    return videoUrl;
  },
  getVid: async (url: string) => {
    const materialId = new URL(url).pathname.split("/").pop();
    if (materialId) {
      const request = await fetch(
        `https://cc.oceanengine.com/creative_radar_api/v1/material/info?material_id=${materialId}&list_type=10`,
        {
          headers: {
            accept: "application/json, text/plain, */*",
            "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
            "cache-control": "no-cache",
            caller: "cc",
            pragma: "no-cache",
            priority: "u=1, i",
            "sec-ch-ua":
              '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"Windows"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
          },
          referrer: window.location.href,
          referrerPolicy: "strict-origin-when-cross-origin",
          body: null,
          method: "GET",
          mode: "cors",
          credentials: "include",
        }
      );
      const data = await request.json();
      return data.data.vid;
    }
    return "";
  },
};
