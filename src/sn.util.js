import { DEFAULT_PORTAL } from "./sn.constants";
import imageCompression from "browser-image-compression";
import { getCategoryObjWithoutAll } from "./sn.category-constants";

export const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export const getPortalFromUserSetting = (userSetting) => {
  if (
    userSetting != null &&
    userSetting.setting != null &&
    userSetting.setting.portal != null &&
    userSetting.setting.portal.trim() !== ""
  ) {
    return userSetting.setting.portal;
  } else {
    return DEFAULT_PORTAL;
  }
};

export const skylinkToUrl = (skyLink, userSetting) => {
  let link = "";
  if (skyLink.indexOf("http://") === 0 || skyLink.indexOf("https://") === 0) {
    link = skyLink;
  } else if (skyLink.indexOf("sia://") === 0) {
    link = skyLink.replace("sia://", getPortalFromUserSetting(userSetting));
  } else if (skyLink.length === 46) {
    link = getPortalFromUserSetting(userSetting) + skyLink;
  }
  return link;
};

export const launchSkyLink = (skyLink, userSetting) => {
  const link = skylinkToUrl(skyLink, userSetting);
  if (link !== "") {
    window.open(link, "_blank");
  }
};

/**
 * Generates thumbnail image file out of the first frame of the video file.
 * 
 * @param {Object} Object
 * @param {string?} Object.url - The video source Url.
 * @param {string?} Object.file - Optional video file object reference. If the Url s not provided, 
 * then this property must have a value. If the url does have a valu then this property will be ignored.
 */

export const generateThumbnailFromVideo = async ({file, url}) => {
  let videoResolve = null;
  const videoPromise = new Promise((resolve) => {
    videoResolve = resolve;
  });
  let video = document.createElement('video');
  video.crossOrigin = "anonymous";
  video.src = url ? url :  URL.createObjectURL(file);
  console.log("video.src", video.src);
  video.onloadeddata = videoResolve;
  video.load();
  await videoPromise;
  const videoThumbnail = await videoToImg(video);
  return videoThumbnail;
};

/**
 * Takes a video element and that has image already loaded and returns an image file which is a thumbnail
 * generated out of the first frame of the video 
 * 
 * @param {Element} video Video Element.
 */

export const videoToImg = async (video) => {
  let canvas = document.createElement("canvas");
  let w = video.videoWidth;
  let h = video.videoHeight;
  canvas.width = w;
  canvas.height = h;
  let ctx = canvas.getContext("2d");
  ctx.drawImage(video, 0, 0, w, h);
  let file = await imageCompression.canvasToFile(canvas, "image/jpeg");
  return file;
};

/**
 * Converts a long string of bytes into a readable format e.g KB, MB, GB, TB, YB
 * 
 * @param {Int} num The number of bytes.
 */
export const readableBytes= (bytes)=>{
  if (bytes==null || isNaN(bytes)){
    return;
  }
  var i = Math.floor(Math.log(bytes) / Math.log(1024)),
  sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  return (bytes / Math.pow(1024, i)).toFixed(2) * 1 + ' ' + sizes[i];
}

/**
 * Compresses Image file to Skyspace params
 * 
 * @param {File} originalFile Original File.
 */
export const getCompressedImageFile = async(originalFile) => await imageCompression(originalFile, {
    maxSizeMB: 1,
    maxWidthOrHeight: 256,
    useWebWorker: true,
  });

  export const subtractSkapps = (superList, sublist) => {
  const skhubIdFrmSubList = [];
  sublist.map((skapp)=>skhubIdFrmSubList.push(skapp.skhubId));
  return superList.filter((el)=> !skhubIdFrmSubList.includes(el.skhubId));
};

export const setTypeFromFile = (fileType, app)=>{
  const categoryObj = getCategoryObjWithoutAll();
  const category = Object.keys(categoryObj).find(category=>categoryObj[category].fileTypeList && categoryObj[category].fileTypeList.indexOf(fileType)>-1);
  category && (app.type=category);
}

export const getAllPublicApps = (appsFromHash, inMemoryAddedApps, inMemoryDeletedApps) => 
  subtractSkapps( [...new Set([...inMemoryAddedApps, ...appsFromHash])] , inMemoryDeletedApps);