export const getEmptySkylinkObject = () => {
  return {
    version: "v1",
    createTS: new Date(),
    lastUpdateTS: new Date(),
    skhubId: "", // hash(provider | userid | skylink) only on creation time
    skylink: "",
    id: null, // not sure why we need this ?
    name: "",
    title: "",
    filename: "",
    description: "",
    type: null, // this field is used to store category. its duplicate with "category" field.
    //merkleroot: "", //from response or response header
    //bitfield: "",//from response or response header
    contentLength:"",//from response header
    contentType:"",//from response or response header
    httpMetadata:"", //Response Header "Skynet-File-Metadata"
    redirect: false, // new feature in Sia 1.5. "redirect" query parameter that disables the redirect to the "defaultPath" when set to true
    defaultPath: "",// new feature in Sia 1.5.
    linkType: SKYLINK_TYPE_FILEUPLOAD, // file, folder or Skapp ?
    category: SKYLINK_TYPE_FILEUPLOAD,// its duplicate with "type" field. currently this field is not used
    skyspaceList: [],
    tags: [], //max 5
    userId: "",
    permission: false,
    ageRating: "", // # applicable only for skapp
    price: "", // # applicable only for skapp
    support: "", // # applicable only for skapp
    git_url: "", // # applicable only for skapp
    demo_url: "", // # applicable only for skapp
    developer: "", // # applicable only for skapp
    appStatus: "", // Alpha/Beta/Live // # applicable only for skapp
    blacklist: "",
    blacklistDate: "",
    blacklistReason: "",
    auth_code: "", // # applicable only for skapp
    fileKey: null,
  };
};

export const getEmptyHistoryObject = () => {
  return {
      skylink: "",
      fileName: "",
      contentLength: "",
      contentType: "",
      httpMetadata: "",
      action: "",
      skhubId: "",
      skyspaces: [],
      savedToSkySpaces: false,
  }
};

export const createEmptyErrObj = () => {
  const errObj = {};
  for (const key in getEmptySkylinkObject()) {
    if (getEmptySkylinkObject().hasOwnProperty(key)) {
      errObj[key] = false;
      errObj[key+".errorMsg"] = "";
    }
  }
  return errObj;
};

export const SKYLINK_TYPE_FILEUPLOAD = 0;
export const SKYLINK_TYPE_DIRUPLOAD = 1;
export const SKYLINK_TYPE_SKYLINK = 2;

export const getSkylinkTypeObj = () => {
  const skylinkTypeObj = {};
  skylinkTypeObj[SKYLINK_TYPE_SKYLINK] = {
    label: "SkyApp URL",
  };
  skylinkTypeObj[SKYLINK_TYPE_FILEUPLOAD] = {
    label: "Upload File",
  };
  skylinkTypeObj[SKYLINK_TYPE_DIRUPLOAD] = {
    label: "Upload Directory",
  };
  return JSON.parse(JSON.stringify(skylinkTypeObj));
};

export const getSkylinkTypeObjForHome = () => {
  const skylinkTypeObj = {};
  skylinkTypeObj[SKYLINK_TYPE_FILEUPLOAD] = {
    label: "Upload File",
  };
  skylinkTypeObj[SKYLINK_TYPE_DIRUPLOAD] = {
    label: "Upload Directory",
  };
  return JSON.parse(JSON.stringify(skylinkTypeObj));
};
