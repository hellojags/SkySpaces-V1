import { ajax } from 'rxjs/ajax';
import { map, catchError } from 'rxjs/operators';
import { genKeyPairFromSeed, parseSkylink, SkynetClient } from "skynet-js";
import { of } from 'rxjs';
import prettyBytes from 'pretty-bytes';
import { APP_SKYDB_SEED, DEFAULT_PORTAL, SKYDB_SERIALIZATION_SEPERATOR } from "../sn.constants";
import { getAllPublicApps } from '../sn.util';
import store from "../reducers";

export const getSkylinkHeader = (skylinkUrl) => ajax({
  url: skylinkUrl+"?format=concat",
  method: "HEAD",
  responseType: "",
  }).pipe(
    map((res) => {
        let headerMap = {};
        let contentType = res.xhr.getResponseHeader('content-type');
        headerMap["contentType"] = contentType;
        console.log("contentType:"+contentType);
        let contentLength = res.xhr.getResponseHeader('content-length');
        headerMap["contentLength"] = contentLength ? prettyBytes(Number(contentLength)):"";
        console.log("contentLength:"+contentLength);
        let skynetFileMetadata = res.xhr.getResponseHeader('Skynet-File-Metadata');
        headerMap["skynetFileMetadata"] = skynetFileMetadata;
        //console.log("skynetFileMetadata:"+skynetFileMetadata);
        //let headerParams = res.xhr.getAllResponseHeaders();
        //console.log("headerParams"+headerParams);
        //console.log("headerMap: "+headerMap);
        return headerMap;
    }),
    catchError(error => {
      console.log('getSkylinkHeader::error: ', error);
      return of(error);
    })
  );


export const uploadToSkynet = async(file, skynetClient)=> await skynetClient.uploadFile(file);

export const getPublicApps = async (hash)=> await fetch((document.location.origin.indexOf("localhost")===-1 ? document.location.origin :  DEFAULT_PORTAL)+"/"+hash).then(res=>res.json());

export const getSkylinkPublicShareFile = (arrApps) => {
  const strArrApps = JSON.stringify(arrApps);
  return new File([strArrApps], "public"+new Date()+".txt", {type: "text/plain", lastModified: new Date()});
}

export const savePublicSpace = async (publicHash, inMemObj) => {
  const publicHashData = await getPublicApps(publicHash);
  const skappListToSave = getAllPublicApps(publicHashData.data, inMemObj.addedSkapps, inMemObj.deletedSkapps);
  publicHashData.history[publicHashData.history.length - 1].skylink = publicHash;
  publicHashData.history.push({
    creationDate: new Date()
  });
  publicHashData.data = skappListToSave;
  const skylinkListFile = getSkylinkPublicShareFile(publicHashData);
  const portal = document.location.origin.indexOf("localhost") === -1 ? document.location.origin : DEFAULT_PORTAL;
  const uploadedContent = await new SkynetClient(portal).uploadFile(skylinkListFile);
  if (uploadedContent){
    return {
      skylink : parseSkylink(uploadedContent)
    };
  }
  return null;
};

/** Start : Skynet Methods **/
const getPortal = ()=> {
  let skynetPortal = store.getState().snUserSetting?.setting?.portal;
  skynetPortal = (skynetPortal && skynetPortal.trim()!=="") ? skynetPortal : DEFAULT_PORTAL;
  return skynetPortal;
}

export const setJSONFile = async (publicKey, privateKey,fileKey,fileData,appendFlag,encrypted,options) => {
  const skynetClient = new SkynetClient(getPortal());
  if (publicKey == null || privateKey == null ) {
    throw new Error("Invalid Keys");
  }
  const jsonObj = await getJSONFile(publicKey, fileKey, null, {getEntry: true});
  if(appendFlag)
  {
    let tempFileData = await getJSONFile(publicKey,fileKey);
    if(fileData != null && tempFileData != null)
      fileData = tempFileData.push(fileData);
  }
  try {
    let revision =  (jsonObj ? jsonObj.revision : 0)  + 1;
    let status = await skynetClient.db.setJSON(privateKey,fileKey,fileData, revision); //<-- update Key Value pair for that specific pubKey
  }
  catch (error) {
    //setErrorMessage(error.message);
    return false;
  }
  return true;
}

export const snKeyPairFromSeed = (userSeed)=>genKeyPairFromSeed(userSeed);

export const snSerializeSkydbPublicKey = (publicKey)=>publicKey;

export const snDeserializeSkydbPublicKey = (publicKeyStr)=>publicKeyStr;

export const getJSONFile = async (publicKey,fileKey,encrypted,options) => {
  const skynetClient = new SkynetClient(getPortal());
  try
  {
    //Get User Public Key
    if (publicKey == null) {
      throw new Error("Invalid Keys");
    }
    const entry = await skynetClient.db.getJSON(publicKey,fileKey);
    if(entry)
    {
      if (options.getEntry) {
        return entry;
      }
      return entry.data;
    }
  }
  catch (error) {
      //setErrorMessage(error.message);
      console.log("error.message "+error.message);
      return null;
    }
    return null;
}
/** END : Skynet Methods **/
