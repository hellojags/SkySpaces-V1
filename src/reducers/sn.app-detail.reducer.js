import {
  ACT_TY_FETCH_APP_DETAIL,
  ACT_TY_FETCH_APP_DETAIL_SUCCESS,
  ACT_TY_FETCH_EMPTY_APP,
  ACT_TY_CREATE_SKAPP_SUCCESS,
} from "../reducers/actions/sn.action.constants";
import {
  SKYLINK_TYPE_SKYLINK,
  getEmptySkylinkObject,
} from "../components/new/sn.new.constants";
import { getCompatibleTags } from "../sn.constants";

export default (state = getEmptySkylinkObject(), action) => {
  switch (action.type) {
    case ACT_TY_FETCH_EMPTY_APP:
      return getEmptySkylinkObject();
    case ACT_TY_FETCH_APP_DETAIL:
      return state;
    case ACT_TY_FETCH_APP_DETAIL_SUCCESS:
    case ACT_TY_CREATE_SKAPP_SUCCESS:
      console.log(action);
      const app = {
        version: "v1",
        createTS: new Date(),
        lastUpdateTS: new Date(),
        skhubId: action.payload.skhubId,
        skylink: action.payload.skylink,
        fileKey: action.payload.fileKey,
        id: action.payload.id,
        name: action.payload.name, // need to find difference between name, title, filename
        title: action.payload.title, // need to find difference between name, title, filename
        filename: action.payload.filename, // need to find difference between name, title, filename
        description: action.payload.description,
        type: action.payload.type, // Category is stored here
        contentLength: action.payload.contentLength,
        contentType: action.payload.contentType,
        httpMetadata: action.payload.httpMetadata,
        thumbnail: action.payload.thumbnail,
        redirect: action.payload.redirect,
        defaultPath: action.payload.defaultPath, //file, folder or Skapp
        linkType: action.payload.linkType, // file, folder or Skapp ?
        category:
          action.payload.category != null
            ? Number(action.payload.category)
            : SKYLINK_TYPE_SKYLINK, // file, folder or Skapp ? we should be using linkType for this value
        skyspaceList:
          action.payload.skyspaceList == null
            ? []
            : action.payload.skyspaceList,
        tags: getCompatibleTags(action.payload.tags),
        userId: action.payload.userId,
        permission:
          action.payload.permission === "true" ||
          action.payload.permission === true,
        fileformat: action.payload.fileformat, // not present in Object Schema? getEmptySkylinkObject()
        git_url: action.payload.git_url,
        bookmark: action.payload.bookmark === "true",
        skyAppSecret: action.payload.skyAppSecret,
        auth_code: action.payload.auth_code,
      };
      return app;
    default:
      return state;
  }
};
