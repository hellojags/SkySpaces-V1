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
export const STORAGE_USER_SESSION_KEY = "USER_SESSION";
export const BROWSER_STORAGE = localStorage;
export const BLOCKSTACK_CORE_NAMES = "https://core.blockstack.org/v1/names";
export const STORAGE_REDIRECT_POST_LOGIN_KEY = "REDIRECT_POST_LOGIN";
export const STORAGE_SKYAPP_DETAIL_KEY = "SKYAPP_DETAIL";
export const STORAGE_SKYSPACE_DETAIL_KEY = "STORAGE_SKYSPACE_DETAIL_KEY";

export const ID_PROVIDER_BLOCKSTACK = "BLOCKSTACK_ID";
export const ID_PROVIDER_SKYDB = "SKYDB_ID";
export const ID_PROVIDER_CERAMIC = "CERAMIC_ID";

export const ADD_SKYSPACE = "ADD_SKYSPACE";
export const RENAME_SKYSPACE = "RENAME_SKYSPACE";
export const DELETE = "DELETE";

export const ADD_PORTAL = "ADD_PORTAL";
export const EDIT_PORTAL = "RENAME_PORTAL";
export const DELETE_PORTAL = "DELETE_PORTAL";

export const APP_SKYDB_SEED = "THE_SKYSPACES_APP_SKYDB_SEED";
export const SKYDB_SERIALIZATION_SEPERATOR = ".";

export const UPLOAD = "Upload";
export const DOWNLOAD = "Download";
export const PUBLIC_IMPORT = "Public Import";
export const DEFAULT_PORTAL = "https://siasky.net/";
export const PUBLIC_SHARE_BASE_URL = "https://siasky.net/AAB-SesrL4TJn8l6F0besVVWYCK8axTjTmffFK4WTBPLWA/?#/";
export const PUBLIC_SHARE_APP_HASH = "AABUuxbDppnCu6Pz4MNWzw2UW63Bl4g-7LKWSHbWD7khcA";
export const PUBLIC_SHARE_ROUTE = "public-cards/";
//export const DOWNLOAD_PORTAL = process.env.REACT_APP_SIASKYNET_HOST;
//export const SKYNETHUB_PORTAL = process.env.REACT_APP_SKYNETHUB_HOST;
export const SKYSPACE_DEFAULT_PATH = "https://skyspaces.io/#/upload";
export const SKYSPACE_HOSTNAME = "https://skyspaces.io";
export const PUBLIC_TO_ACC_QUERY_PARAM = "sharedhash";
export const MUSIC_SVG_BASE64_DATA = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgMjUgMjUiID48c3R5bGUgdHlwZT0idGV4dC9jc3MiPi5zdDB7ZmlsbC1ydWxlOmV2ZW5vZGQ7Y2xpcC1ydWxlOmV2ZW5vZGQ7fTwvc3R5bGU+PGc+PHBhdGggY2xhc3M9InN0MCIgZD0iTTEyIDNsLjAxIDEwLjU1Yy0uNTktLjM0LTEuMjctLjU1LTItLjU1QzcuNzkgMTMgNiAxNC43OSA2IDE3czEuNzkgNCA0LjAxIDRTMTQgMTkuMjEgMTQgMTdWN2g0VjNoLTZ6bS0xLjk5IDE2Yy0xLjEgMC0yLS45LTItMnMuOS0yIDItMiAyIC45IDIgMi0uOSAyLTIgMnoiLz48L2c+PC9zdmc+';
