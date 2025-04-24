/**
 * 快手/快手开创
 */

export const kuaishou = {
  getVideoUrl: async (url: string, request: any) => {
    const photoId = new URL(url).pathname.split("/").pop();
    if (!photoId) throw new Error("photoId不存在");
    const cookie = await kuaishou.getCookie(request);
    console.log("cookie", cookie);
    const res = await fetch("https://www.kuaishou.com/graphql", {
      method: "post",
      headers: {
        "content-type": "application/json",
        cookie: `kpf=PC_WEB; clientid=3; did=${cookie}; kpn=KUAISHOU_VISION`,
      },
      body: `{"operationName":"visionVideoDetail","query":"query visionVideoDetail($photoId: String, $type: String, $page: String, $webPageArea: String) {  visionVideoDetail(photoId: $photoId, type: $type, page: $page, webPageArea: $webPageArea) {    status    type    author {      id      name      following      headerUrl      __typename    }    photo {      id      duration      caption      likeCount      realLikeCount      coverUrl      photoUrl      liked      timestamp      expTag      llsid      viewCount      videoRatio      stereoType      croppedPhotoUrl      manifest {        mediaType        businessType        version        adaptationSet {          id          duration          representation {            id            defaultSelect            backupUrl            codecs            url            height            width            avgBitrate            maxBitrate            m3u8Slice            qualityType            qualityLabel            frameRate            featureP2sp            hidden            disableAdaptive            __typename          }          __typename        }        __typename      }      __typename    }    tags {      type      name      __typename    }    commentLimit {      canAddComment      __typename    }    llsid    danmakuSwitch    __typename  }}","variables":{"page":"detail","photoId":"${photoId}","webPageArea":"homexxbrilliant"}}`,
    });
    const data = await res.json();
    return data.data.visionVideoDetail.photo.photoUrl;
  },
  getCookie: async (request: any) => {
    await fetch(request.url, {
      headers: {
        accept: "*/*",
        "accept-language": "zh-CN,zh;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
        "sec-ch-ua":
          '"Chromium";v="134", "Not:A-Brand";v="24", "Microsoft Edge";v="134"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
      },
      referrer: request.url,
      referrerPolicy: "unsafe-url",
      body: null,
      method: "GET",
      mode: "cors",
      credentials: "include",
    });
    return new Promise((resolve, reject) => {
      chrome.cookies.get(
        {
          url: "https://kuaishou.com",
          name: "did",
        },
        function (cookie) {
          if (cookie) resolve(cookie.value);
          else reject(new Error("Cookie不存在"));
        }
      );
    });
  },
};
