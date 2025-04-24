// import { cc } from "../background/watermark/module/cc";

// const runtime = chrome.runtime;

// document.addEventListener("click", handleClick);

// async function handleClick(e: MouseEvent) {
//   const target = e.target as HTMLElement;
//   const parmas: Record<string, string> = {};
//   // 如果是巨量创意 判断元素父级是否在 .radar-detail-preview-container 中
//   if (window.location.href.includes("oceanengine.com")) {
//     if (!!target.closest(".radar-detail-preview-container")) {
//       parmas.url = window.location.href;
//       // 如果是巨量平台 获取vid
//       parmas.vid = await cc.getVid(parmas.url);
//     } else {
//       return;
//     }
//   }
//   if (window.location.href.includes("kc.kuaishou.com")) {
//     if (!!target.closest(".ant-modal-body")) {
//       parmas.url = window.location.href;
//       const video = target.closest(".ant-modal-body").querySelector("video");
//       if (video) {
//         const poster = video.poster;
//         if (poster) {
//           const posterUrl = new URL(poster);
//           // 获取clientCacheKey参数
//           const clientCacheKey = posterUrl.searchParams.get("clientCacheKey");
//           // 去除后缀
//           const clientCacheKeyWithoutSuffix = clientCacheKey?.split(".")[0];
//           if (clientCacheKeyWithoutSuffix) {
//             parmas.url = `https://www.kuaishou.com/short-video/${clientCacheKeyWithoutSuffix}`;
//           } else {
//             return;
//           }
//         } else {
//           return;
//         }
//       } else {
//         return;
//       }
//     } else {
//       return;
//     }
//   }
//   runtime.sendMessage(
//     {
//       action: "call-video-url",
//       ...parmas,
//     }, // 参数通过对象传递
//     (response) => console.log("收到回调:", response) // 异步回调
//   );
// }
