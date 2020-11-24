import crypto from 'crypto';
import {getJSONFile,setJSONFile, snDeserializeSkydbPublicKey, snKeyPairFromSeed} from "../skynet/sn.api.skynet";
import { SkynetClient } from "skynet-js";
import { getUserSessionType } from '../sn.util';
import { ID_PROVIDER_BLOCKSTACK, ID_PROVIDER_SKYDB } from '../sn.constants';

export function generateSkyhubId(inputStr) {
  return crypto.createHash('sha256').update(inputStr + (new Date())).digest('base64').replace("/", "+");
}
export async function listFiles(session) {
  const pathList = [];
  await session.listFiles((res) => {
    pathList.push(res);
    return true;
  })
  return pathList;
}
export async function encryptContent(session, content, options) {
  let promise;
  const sessionType = getUserSessionType(session);
  switch(sessionType){
    case ID_PROVIDER_SKYDB:
      promise = new Promise((resolve, reject) => {
                  resolve(content);
                });
      break;
    case ID_PROVIDER_BLOCKSTACK:
    default:
      promise =  session.encryptContent(content, options);
  }
  return await promise;
}
export async function decryptContent(session, content, options) {
  let promise;
  const sessionType = getUserSessionType(session);
  switch(sessionType){
    case ID_PROVIDER_SKYDB:
      promise = new Promise((resolve, reject) => {
                  resolve(content);
                });
      break;
    case ID_PROVIDER_BLOCKSTACK:
    default:
      promise =  session.decryptContent(content, options);
  }
  return await promise;
}
export const getFileUsingPublicKeyStr = async (publicKeyStr, FILE_PATH )=> {
  const result = await getJSONFile(snDeserializeSkydbPublicKey(publicKeyStr) ,FILE_PATH,null,{});
  return JSON.parse(result);
};

export function getFile(session, FILE_PATH, param) {
  let promise;
  const sessionType = getUserSessionType(session);
  switch(sessionType){
    case ID_PROVIDER_SKYDB:
      const { publicKey } =   snKeyPairFromSeed(session.skydbseed);
      promise = getJSONFile(publicKey,FILE_PATH,null,{})
            .then((content) => {
              if (content) {
                //return JSON.parse(content);
                return content;
              }
            });
      break;
    case ID_PROVIDER_BLOCKSTACK:
    default:
      const options = { decrypt: param?.decrypt ?? true };
      promise =  session.getFile(FILE_PATH, options)
      .then(res=>JSON.parse(res));
  }
  return promise
    .catch(err => {
      if (err.code === "does_not_exist") {
        return null;
      } else {
        return err;
      }
    })
}
// Replace file content with new "content"
export function putFile(session, FILE_PATH, content, param) {
  let promise;
  if (content.hasOwnProperty("lastUpdateTS")) {
    content.lastUpdateTS = new Date();
  }
  const sessionType = getUserSessionType(session);
  switch(sessionType){
    case ID_PROVIDER_SKYDB:
      const { publicKey, privateKey } =  snKeyPairFromSeed(session.skydbseed);
      promise = setJSONFile(publicKey,privateKey,FILE_PATH,content,false,false,{});
      break;
    case ID_PROVIDER_BLOCKSTACK:
    default:
      const options = { decrypt: param?.decrypt ?? true };
      promise =  session.putFile(FILE_PATH, JSON.stringify(content), options)
  }
  return promise
  .catch(err => {
    if (err?.code !== "precondition_failed_error") {
      throw err;
    }
  });
}

export async function putFileForShared(session, FILE_PATH, encryptedContent) {
  const sessionType = getUserSessionType(session);
  let promise;
  switch(sessionType){
    case ID_PROVIDER_SKYDB:
      const { publicKey, privateKey } =  snKeyPairFromSeed(session.skydbseed);
      promise = setJSONFile(publicKey,privateKey,FILE_PATH,encryptedContent,false,false,{});
      break;
    case ID_PROVIDER_BLOCKSTACK:
    default:
      try {
        await deleteFile(session, FILE_PATH);
      } catch(e){}
      promise = session.putFile(FILE_PATH, encryptedContent, { encrypt: false, dangerouslyIgnoreEtag: true });
  }
  promise
  .catch(err => {
      if (err?.code !== "precondition_failed_error") {
        throw err;
      }
    });
}

// Replace file content with new "content"
export function deleteFile(session, FILE_PATH) {
  const sessionType = getUserSessionType(session);
  let promise;

  switch(sessionType){
    case ID_PROVIDER_SKYDB:
      const { publicKey, privateKey } =  snKeyPairFromSeed(session.skydbseed);
      promise = setJSONFile(publicKey,privateKey,FILE_PATH,null,false,false,{});
      break;
    case ID_PROVIDER_BLOCKSTACK:
    default:
      const options = { encrypt: true }
      promise =  session.deleteFile(FILE_PATH, options);
  }
  return promise;
}
export function jsonCopy(object) {
  return JSON.parse(JSON.stringify(object))
}




/**
 * Return a JSON object with the username
 * and domain of the kingdom
 *
 * Accepts URLs of the format:
 * https://example.com/kingdom/username.id
 * @param  {string} url
 * @return {Object} an Object with keys `app` and `username`
 */
export function subjectFromKingdomUrl(url) {
  const tokens = url.split('/kingdom')
  const app = tokens[0]
  const username = tokens[1].split('/')[1]
  return {
    app,
    username
  }
}
/*
export function resolveSubjects(component, userSession, subjects) {
  subjects.map((subject, index) => {
    const options = {
      decrypt: false,
      app: subject.app,
      username: subject.username
    }
    return userSession.getFile(ME_FILENAME, options) // fetch me.json for each subject
    .then(content => {
      if(!content) {

        subjects[index] = Object.assign({}, subject, { missing: true })
        component.setState({ subjects })
        return subjects
      } else {
        subjects[index] = Object.assign({}, subject, { missing: false }, JSON.parse(content))
        component.setState({ subjects })
        return subjects
      }

    })
  })
}
export function loadRuler(userSession, username, app) {
  const options = { decrypt: false, username, app }
  return userSession.getFile(ME_FILENAME, options)
  .then((content) => {
    if(content) {
      const ruler = JSON.parse(content)
      return ruler
    } else {
      const ruler = null
      return ruler
    }
  })
}

export function loadSubjects(userSession, username, app) {
  const options = { decrypt: false, username, app }
  return userSession.getFile(SUBJECTS_FILENAME, options)
  .then((content) => {
    if(content) {
      const subjects = JSON.parse(content)
      return subjects
    } else {
      return []
    }
  })
}
*/
