// File names in GAIA Storage
// /skhub/skylink/data/{skhubId}.json // content of "skhub.json"
// /skhub/skylink/skylinkIdx.json

// /skhub/skyspaces/{skyspace 1}.json
// /skhub/skyspaces/{skyspace 2}.json
// /skhub/skyspaces/skyspaceIdx.json

// /skhub/history/data/history.json
// /skhub/usersettings.json
import { DEFAULT_PORTAL } from "../sn.constants";
import { UserSession, AppConfig } from "blockstack";

export const GAIA_HUB_URL = "https://gaia.blockstack.org/hub";
export const PROFILE_PATH = "skhub/profile.json";// this will be added by "Master Key/Seed" from ID Page. each master key will derive 1 or more child seeds (Pub/Private key).
export const FOLLOWING_PATH = "skhub/following.json"; // will contain array of public key[array of Users]. this key will be set by app specific pub key/User 
export const FOLLOWER_PATH = "skhub/follower.json";// will contain array of public key[array of Users]. this key will be set by app specific pub key/User
export const PUBLIC_KEY_PATH = "skhub/key/publicKey.json";
export const SKYLINK_PATH = "skhub/skylink/data/";
export const BACKUP_FILEPATH = "skhub/backup/backup.json";
export const SKYLINK_IDX_FILEPATH = "skhub/skylink/skylinkIdx.json";
export const SKYSPACE_PATH = "skhub/skyspaces/";
export const SHARED_PATH_PREFIX = "skhub/shared/";
export const SHARED_BY_USER_FILEPATH = "skhub/shared/sharedByUser.json";
export const SHARED_WITH_FILE_PATH = "skhub/shared/sharedWithUser.json ";
export const SKYSPACE_IDX_FILEPATH = "skhub/skyspaces/skyspaceIdx.json";
export const HISTORY_FILEPATH = "skhub/history/history.json";
export const USERSETTINGS_FILEPATH = "skhub/settings/usersetting.json";
export const SKYNET_PORTALS_FILEPATH = "skhub/settings/portals/portals.json";
export const SUBSCRIBED_IDX_FILEPATH = "skhub/subscribed.json";
export const EXPLORER_URL = "https://explorer.blockstack.org";
export const SUCCESS = "success";
export const FAILED = "failed";
export const FAILED_DECRYPT_ERR = "FailedDecryptionError";
export const ID_PROVIDER = "BLOCKSTACK";
export const avatarFallbackImage =
  "https://s3.amazonaws.com/onename/avatar-placeholder.png";
export const IGNORE_PATH_IN_BACKUP = [USERSETTINGS_FILEPATH, SKYNET_PORTALS_FILEPATH];
export const authOrigin = ""; //browser.blockstack.org is authenticator
//(process.env.APP_ENV === 'development') ? 'http://localhost:3000' : "https://skyspaces.io";
export const appDetails = {
  name: "SkySpaces",
  icon: "https://skyspaces.io/logo192.png",
};
const appConfig = new AppConfig(["store_write", "publish_data"]);
export const userSession = new UserSession({ appConfig: appConfig });

export const createPersonObject = () => {
  return {
    name() {
      return "Anonymous";
    },
    avatarUrl() {
      return avatarFallbackImage;
    },
  };
};

export const createHistoryObject = () => {}

// skylinkIdx.json file will have array of SkylinkIdxObj
export const createSkylinkIdxObject = () => {
  return {
    version: "v1",
    createTS: new Date(),
    lastUpdateTS: new Date(),
    skhubIdList: [],
  };
};

export const createSkySpaceIdxObject = () => {
  return {
    version: "v1",
    createTS: new Date(),
    lastUpdateTS: new Date(),
    skyspaceList: [], // "name" of skyspace
  };
};

export const createSkySpaceObject = () => {
  return {
    version: "v1",
    createTS: new Date(),
    lastUpdateTS: new Date(),
    skyspace: "", //  "Name" of skyspace -> "SkySpace1,SkySpace2..etc"
    skhubIdList: [], // All bookmarked Skylinks
  };
};

export const INITIAL_SETTINGS_OBJ = () => {
  return {
  version: "v1",
  createTS: new Date(),
  lastUpdateTS: new Date(),
  setting: {
    portal: DEFAULT_PORTAL,
    backupList: []
  }};
};

export const INITIAL_PORTALS_OBJ = {
  version: "v1",
  createTS: new Date(),
  lastUpdateTS: new Date(),
  portals: [
    {
      //portalId: 1,
      createTS: new Date(),
      name: "SkynetHub.io",
      url: "https://skynethub.io/",
      //priority: "1",
      type: "public",
      selected: 1,
      //usage: "UPLOAD/DOWNLOAD",
      //subscription: "Free"
    },
    {
      //portalId: 2,
      createTS: new Date(),
      name: "SiaSky.net",
      url: "https://siasky.net/",
      //priority: "2",
      type: "public",
      selected: 0,
      //usage: "UPLOAD/DOWNLOAD",
      //subscription: "Paid"
    },
    {
      //portalId: 3,
      createTS: new Date(),
      name: "SiaCDN.com",
      url: "https://www.siacdn.com",
      //priority: "3",
      type: "public",
      selected: 0,
      //usage: "UPLOAD/DOWNLOAD",
      //subscription: "Paid"
    },
  ],
};

export const HISTORY_DATA = [
  {
    skhubId: "sfhskdfhksdfhskadfhaskf",
    skylink: "_B3VrECGOHPEAFknVQwj_vWsyaX_8iIRuB_TL09cuj9uZQ",
    fileName: "",
    size: "",
    contentType: "",
    action: "up",
    timestamp: "2020-03-12T13:37:27+00:00", //ISO 8601
  },
];
