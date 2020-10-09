export const getCompatibleTags = (resCategory) => {
  let category = [];
  if (resCategory != null) {
    if (Array.isArray(resCategory)) {
      category = resCategory.map((cat) => cat.toLowerCase());
    } else {
      category = [resCategory.toLowerCase()];
    }
  }
  return JSON.parse(JSON.stringify(category));
};

export const getSkyspaceListForCarousalMenu = (snSkyspaceList) => {
  if (snSkyspaceList != null) {
    const carousalMenuObj = {};
    snSkyspaceList.forEach((skyspace) => {
      carousalMenuObj[skyspace] = {
        label: skyspace,
      };
    });
    return carousalMenuObj;
  }
};

export const WEBSERVICE_SUCCESS = "success";
export const WEBSERVICE_FAILURE = "failure";
export const APP_TITLE = "SkySpaces";
export const APP_BG_COLOR = "var(--app-bg-color)";
export const ITEMS_PER_PAGE = 9;
export const STORAGE_SKYSPACE_APP_COUNT_KEY = "SKYSPACE_APP_COUNT";
export const STORAGE_USER_KEY = "USER";
export const STORAGE_SKYSPACE_LIST_KEY = "SKYSPACELIST";
export const STORAGE_USER_SETTING_KEY = "USER_SETTING";
export const STORAGE_PORTALS_LIST_KEY = "PORTALS_LIST";
export const BROWSER_STORAGE = localStorage;
export const STORAGE_REDIRECT_POST_LOGIN_KEY = "REDIRECT_POST_LOGIN";
export const STORAGE_SKYAPP_DETAIL_KEY = "SKYAPP_DETAIL";
export const STORAGE_SKYSPACE_DETAIL_KEY = "STORAGE_SKYSPACE_DETAIL_KEY"

export const ADD_SKYSPACE = "ADD_SKYSPACE";
export const RENAME_SKYSPACE = "RENAME_SKYSPACE";
export const DELETE = "DELETE";

export const ADD_PORTAL = "ADD_PORTAL";
export const EDIT_PORTAL = "RENAME_PORTAL";
export const DELETE_PORTAL = "DELETE_PORTAL";

export const UPLOAD = "Upload";
export const DOWNLOAD = "Download";
export const PUBLIC_IMPORT = "Public Import";
export const DEFAULT_PORTAL = "https://siasky.net/";
export const PUBLIC_SHARE_BASE_URL = "https://siasky.net/AABC04CAABYTYLap7aEjTOHHrE59Sg5gtYmwW-2xkywQUA/?#/";
export const PUBLIC_SHARE_APP_HASH = "AABC04CAABYTYLap7aEjTOHHrE59Sg5gtYmwW-2xkywQUA";
export const PUBLIC_SHARE_ROUTE = "public-cards/";
//export const DOWNLOAD_PORTAL = process.env.REACT_APP_SIASKYNET_HOST;
export const SKYNETHUB_PORTAL = process.env.REACT_APP_SKYNETHUB_HOST;
export const SKYSPACE_DEFAULT_PATH = "https://skyspaces.io/#/upload";
export const PUBLIC_TO_ACC_QUERY_PARAM = "sharedhash";
