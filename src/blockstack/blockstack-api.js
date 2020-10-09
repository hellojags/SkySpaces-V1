import { createSkySpaceIdxObject } from './constants'
import { getPublicKeyFromPrivate } from 'blockstack';
import {
    SKYLINK_PATH,
    SHARED_WITH_FILE_PATH,
    SKYLINK_IDX_FILEPATH,
    SKYSPACE_PATH,
    SKYSPACE_IDX_FILEPATH,
    ID_PROVIDER,
    createSkylinkIdxObject,
    INITIAL_SETTINGS_OBJ,
    INITIAL_PORTALS_OBJ,
    HISTORY_FILEPATH,
    USERSETTINGS_FILEPATH, SKYNET_PORTALS_FILEPATH, SUCCESS, FAILED, createSkySpaceObject,
    FAILED_DECRYPT_ERR,
    IGNORE_PATH_IN_BACKUP,
    PUBLIC_KEY_PATH,
    SHARED_PATH_PREFIX,
    GAIA_HUB_URL
} from './constants'
import {
    getFile,
    putFile,
    deleteFile,
    generateSkyhubId,
    listFiles,
    encryptContent,
    decryptContent,
    putFileForShared
} from './utils'

// /skhub/skylink/data/{skhubId}.json // content of "skhub.json"
// /skhub/skylink/skylinkIdx.json

// /skhub/skyspaces/{skyspace 1}.json 
// /skhub/skyspaces/{skyspace 2}.json 
// /skhub/skyspaces/skyspaceIdx.json

// Need to maintain following Objects in REDUX STORE
//session, person, skylinkObj, skylinkIdxObj, skyspaceObj, skyspaceIdxObj, historyObj, usersettingObj

// #######################################
// ############ login/logout ############
// doSignIn
// doSignOut
// #######################################
/* 
export const doSignIn = (session) => {
    //const session = this.userSession
    const options = { decrypt: false }
    if (!session.isUserSignedIn() && session.isSignInPending()) {
      session.handlePendingSignIn()
        .then((userData) => {
        console.log(userData);
        if (!userData.username) {
          throw new Error('This app requires a username.')
        }
        console.log("### user data this.userSession.loadUserData() ###",this.userSession.loadUserData())
      })
    }
  }

  export const doSignOut = (session) => {
   session.signUserOut(window.location.origin);
  }
 */
// #######################################################################
// ################################ Skylink  ############################
// addSkylink
// addAllSkylinks
// getSkylink
// getAllSkylinks
// deleteSkylink
// deleteAllSkylinks
// #######################################################################

//Add OR Update skylink Object
export const bsAddSkylinkOnly = async (session, skylinkObj, person) => {
    if (person == null) {
        return;
    }
    let skhubId = skylinkObj.skhubId;
    if (skylinkObj && (skylinkObj.skhubId == null || skylinkObj.skhubId === "")) {
        skhubId = generateSkyhubId(ID_PROVIDER + ":" + person.profile.decentralizedID + ":" + skylinkObj.skylink)
        skylinkObj.skhubId = skhubId;
    }
    const SKYLINK_FILEPATH = SKYLINK_PATH + skhubId + ".json"
    await putFile(session, SKYLINK_FILEPATH, skylinkObj);
    return skhubId;
};

export const bsAddSkhubListToSkylinkIdx = async (session, skhubIdList) => {
    let skylinkIdxObj = await getFile(session, SKYLINK_IDX_FILEPATH);
    if (skylinkIdxObj === FAILED) {
        return skylinkIdxObj;
    }
    if (!skylinkIdxObj) {
        skylinkIdxObj = createSkylinkIdxObject();
    }
    skylinkIdxObj.skhubIdList = [...new Set([...skylinkIdxObj.skhubIdList, ...skhubIdList])];
    return putFile(session, SKYLINK_IDX_FILEPATH, skylinkIdxObj);
};

export const bsAddSkylink = async (session, skylinkObj, person) => {
    // check if skhubId is present. If new Object, this value will be empty
    if (person == null) {
        return;
    }
    let skhubId = skylinkObj.skhubId;
    if (skylinkObj && (skylinkObj.skhubId == null || skylinkObj.skhubId === "")) {
        skhubId = generateSkyhubId(ID_PROVIDER + ":" + person.profile.decentralizedID + ":" + skylinkObj.skylink)
        skylinkObj.skhubId = skhubId;
    }
    const SKYLINK_FILEPATH = SKYLINK_PATH + skhubId + ".json"
    return putFile(session, SKYLINK_FILEPATH, skylinkObj)
        .then((status) => {
            if (status === FAILED) {
                return status;
            }
            //Step2: add Skylink reference to SkylinkIdx JSON file
            return getFile(session, SKYLINK_IDX_FILEPATH);
        })
        .then((skylinkIdxObj) => {
            if (skylinkIdxObj === FAILED) {
                return skylinkIdxObj;
            }
            if (!skylinkIdxObj) //empty
            {
                skylinkIdxObj = createSkylinkIdxObject()
            }
            else
                if (skylinkIdxObj.skhubIdList.indexOf(skhubId) > -1) {
                    return FAILED;
                }
            skylinkIdxObj.skhubIdList.push(skhubId)
            return putFile(session, SKYLINK_IDX_FILEPATH, skylinkIdxObj)
        })
        .then(res => skhubId)
        .catch(err => {
            return FAILED;
        });
}

export const getSkyLinkIndex = (session) => {
    return getFile(session, SKYLINK_IDX_FILEPATH)
        .catch(err => null);
}

export const addAllSkylinks = (skylinkObjList) => {
    // TODO
}

export const getSkylink = (session, skhubId) => {
    const SKYLINK_FILEPATH = SKYLINK_PATH + skhubId + ".json";
    return getFile(session, SKYLINK_FILEPATH)
        .then(res => {
            return res;
        })
}

export const getSkylinkIdxObject = (session) => {
    return getFile(session, SKYLINK_IDX_FILEPATH)
        .then(res => {
            return res;
        })
}

export const getAllSkylinks = (session) => {
    const skapps = [];
    return getFile(session, SKYLINK_IDX_FILEPATH)
        .then(skylinkIdxObj => {
            if (skylinkIdxObj && skylinkIdxObj.skhubIdList && skylinkIdxObj.skhubIdList.length > 0) {
                const promises = [];
                skylinkIdxObj.skhubIdList.forEach(skhubId => {
                    promises.push(
                        getSkylink(session, skhubId)
                            .then(skapp => {
                                skapps.push(skapp)
                            }))
                });
                return Promise.all(promises)
                    .then(() => {
                        return skapps;
                    });
            } else {
                return [];
            }
        })
        .catch(err => []);
}

export const bsDeleteSkylink = (session, skhubId) => {
    //Step1: delete Skylink JSON
    const SKYLINK_FILEPATH = SKYLINK_PATH + skhubId + ".json"
    return deleteFile(session, SKYLINK_FILEPATH)
        .then((status) => {
            return getFile(session, SKYLINK_IDX_FILEPATH)
        })
        .then(skylinkIdxObj => {
            if (skylinkIdxObj && skylinkIdxObj.skhubIdList.indexOf(skhubId) > -1) {
                const idx = skylinkIdxObj.skhubIdList.indexOf(skhubId);
                skylinkIdxObj.skhubIdList.splice(idx, 1);
                return putFile(session, SKYLINK_IDX_FILEPATH, skylinkIdxObj);
            } else {
                return FAILED;
            }
        })
        .catch(err => {
            return FAILED;
        })
}
/*
export const deleteAllSkylinks = (skyhubIdList) => {
    // TODO
}
 */
// #######################################################################
// ##################### SkySpace, SkySPaceList  #########################
// addSkySpace
// renameSkySpace
// getAllSkySpaceNames
// getSkySpace
// addToSkySpaceList
// removeFromSkySpaceList
// #######################################################################

export const putDummyFile = (session) => {
    const SKYSPACE_FILEPATH = SKYSPACE_PATH + 'dummy.json';
    return putFile(session, SKYSPACE_FILEPATH, { "props": "1" })
        .then(res => {
            return res;
        })
        .catch(err => {
        })
}

export const deleteDummyFile = (session) => {
    const SKYSPACE_FILEPATH = SKYSPACE_PATH + 'dummy.json';
    return deleteFile(session, SKYSPACE_FILEPATH)
        .then(res => {
            return res;
        })
        .catch(err => {
        })
}

export const bsAddDeleteSkySpace = async (session, skyspaceName, isDelete) => {
    try {
        // Step 1: Add SkySpace entry in skyspaceIdx file
    const SKYSPACE_FILEPATH = SKYSPACE_PATH + skyspaceName + ".json";
    let skyspaceIdxObj = await getFile(session, SKYSPACE_IDX_FILEPATH);
    if (!skyspaceIdxObj) {
      skyspaceIdxObj = createSkySpaceIdxObject();
      if (isDelete == null) {
        skyspaceIdxObj.skyspaceList.push(skyspaceName);
      }
    } else if (
      skyspaceIdxObj &&
      skyspaceIdxObj.skyspaceList.indexOf(skyspaceName) > -1
    ) {
      // SKySpace already present and we dont want to overwrite. USe 'Update' method for overwrite
      if (isDelete == null) {
        return FAILED;
      } else {
        const idx = skyspaceIdxObj.skyspaceList.indexOf(skyspaceName);
        skyspaceIdxObj.skyspaceList.splice(idx, 1);
      }
    } else {
      if (isDelete == null) {
        skyspaceIdxObj.skyspaceList.push(skyspaceName);
      } else {
        return FAILED;
      }
    }
    await putFile(session, SKYSPACE_IDX_FILEPATH, skyspaceIdxObj);
    if (isDelete == null) {
      const skyspaceObj = createSkySpaceObject();
      skyspaceObj.skyspace = skyspaceName;
      await putFile(session, SKYSPACE_FILEPATH, skyspaceObj);
    } else {
      await deleteFile(session, SKYSPACE_FILEPATH);
    }
    return SUCCESS;
  } catch (err) {
    return FAILED;
  }
};

export const bsRenameSkySpace = (session, oldSkyspaceName, newSkyspaceName) => {
    const SKYSPACE_FILEPATH = SKYSPACE_PATH + oldSkyspaceName + '.json';
    const SKYSPACE_FILEPATH_NEW = SKYSPACE_PATH + newSkyspaceName + '.json';
    return getFile(session, SKYSPACE_IDX_FILEPATH)
        .then((skyspaceIdxObj) => {
            if (skyspaceIdxObj && skyspaceIdxObj.skyspaceList.indexOf(oldSkyspaceName) > -1) {
                const idx = skyspaceIdxObj.skyspaceList.indexOf(oldSkyspaceName);
                skyspaceIdxObj.skyspaceList.splice(idx, 1, newSkyspaceName)
                return putFile(session, SKYSPACE_IDX_FILEPATH, skyspaceIdxObj)
                // SKySpace already present and we dont want to overwrite. USe 'Update' method for overwrite
            }
            else {
                // Couldn't find oldSkyspaceName in Idx
                return FAILED
            }
        })
        .then(res => {
            if (res === FAILED) {
                return FAILED;
            }

            return getFile(session, SKYSPACE_FILEPATH)
        })
        .then(skyspaceObj => {
            if (skyspaceObj == null || skyspaceObj === FAILED) {
                return FAILED;
            }
            skyspaceObj.skyspace = newSkyspaceName
            return putFile(session, SKYSPACE_FILEPATH_NEW, skyspaceObj)
        })
        .then((status) => {
            return deleteFile(session, SKYSPACE_FILEPATH)
        })
        .catch(err => {
        });

}

export const bsGetAllSkySpaceNames = (session) => {
    return getFile(session, SKYSPACE_IDX_FILEPATH).then((skyspaceIdxObj) => {
        if (skyspaceIdxObj && skyspaceIdxObj.skyspaceList) {
            return skyspaceIdxObj.skyspaceList;
        } else if (skyspaceIdxObj && skyspaceIdxObj.name === FAILED_DECRYPT_ERR) {
            return deleteFile(session, SKYSPACE_IDX_FILEPATH)
                .then(() => []);
        } else {
            return [];
        }
    })
        .catch(err => []);

}

export const bsGetSkyspaceAppCount = (session) => {
    const skyspaceAppCountObj = {};
    return bsGetAllSkySpaceNames(session)
    .then(skyspaceList => {
        const promises = [];
        skyspaceList.forEach(skyspaceName => {
            promises.push(getSkySpace(session, skyspaceName)
            .then(skyspaceObj=>{
                if (skyspaceObj != null && skyspaceObj.skhubIdList!=null) {
                    skyspaceAppCountObj[skyspaceName]=skyspaceObj.skhubIdList.length;
                }
            }));
        });
        return Promise.all(promises)
        .then(() => {
            return skyspaceAppCountObj;
        });
    })
}

export const bsGetAllSkyspaceObj = async (session) => {
    const skyspaceObjList = {};
    const skyspaceList = await bsGetAllSkySpaceNames(session);
    const promises = [];
    skyspaceList.forEach(skyspaceName=> {
        promises.push(getSkySpace(session, skyspaceName)
            .then(skyspaceObj=>{
                skyspaceObjList[skyspaceName] = skyspaceObj.skhubIdList;
            }));
    });
    await Promise.all(promises);
    return skyspaceObjList;
}

export const bsRemoveSkylinkFromSkyspaceList = (session, skhubId, skyspaceList) => {
    const promises = [];
    skyspaceList.forEach(skyspaceName => {
        promises.push(bsRemoveFromSkySpaceList(session, skyspaceName, skhubId)
            .catch(err => ""));
    });
    return Promise.all(promises)
        .then(() => {
            return;
        });
}
// Add SkhubId to List of SkySpaces
export const bsAddSkylinkFromSkyspaceList = async (session, skhubId, skyspaceList) => {
    const promises = [];
    skyspaceList.forEach(skyspaceName => {
        promises.push(addToSkySpaceList(session, skyspaceName, skhubId)
            .catch(err => ""));
    });
    await Promise.all(promises);
    return;
}

export const bsGetSkyspaceNamesforSkhubId = (session, skhuId) => {
    const skyspaceForSkhubIdList = [];
    return bsGetAllSkySpaceNames(session)
        .then(skyspaceList => {
            const promises = [];
            skyspaceList.forEach(skyspace => {
                promises.push(getSkySpace(session, skyspace)
                    .then(skyspaceObj => {
                        if (skyspaceObj != null && skyspaceObj.skhubIdList.indexOf(skhuId) > -1) {
                            skyspaceForSkhubIdList.push(skyspace);
                        }
                    }));
            });
            return Promise.all(promises)
                .then(() => {
                    return skyspaceForSkhubIdList;
                });
        })
        .then((skyspaceForSkhubIdList) => {
            let isAppOwner = false;
            return getSkyLinkIndex(session)
                .then((skylinkIndex) => {
                    if (
                        skylinkIndex != null &&
                        skylinkIndex.skhubIdList.includes(skhuId)
                    ) {
                        isAppOwner = true;
                    }
                    return { skyspaceForSkhubIdList, isAppOwner };
                })
        })
}

export const getSkyspaceApps = (session, skyspaceName) => {
    const skapps = [];
    return getSkySpace(session, skyspaceName)
        .then(skyspaceObj => {
            const skhubIdList = skyspaceObj.skhubIdList;
            if (skhubIdList == null) {
                return [];
            }
            const promises = [];
            skhubIdList.forEach(skhubId => {
                promises.push(
                    getSkylink(session, skhubId)
                        .then(skapp => {
                            skapps.push(skapp)
                        }))
            });
            return Promise.all(promises)
                .then(() => {
                    return skapps;
                });
        })
}

export const getSkySpace = (session, skyspaceName) => {
    const SKYSPACE_FILEPATH = SKYSPACE_PATH + skyspaceName + '.json';
    return getFile(session, SKYSPACE_FILEPATH).then((skyspaceObj) => {
        return skyspaceObj;
    })
}

export const bsPutSkyspaceInShared = (session, encryptedContent, skyspaceName, shareToId) => {
    const SHARED_SKYSPACE_FILEPATH = SHARED_PATH_PREFIX + shareToId + "/" + SKYSPACE_PATH + skyspaceName + '.json';
    return putFileForShared(session, SHARED_SKYSPACE_FILEPATH, encryptedContent);
    // return deleteFile(session, SHARED_SKYSPACE_FILEPATH);
}

export const bsGetSharedSkyspaceIdxFromSender = async (session, senderStorageId, skyspaceName) => {
    const myPublicKey = getPublicKeyFromPrivate(session.loadUserData().appPrivateKey);
    const encryptedContent = await fetch(`${GAIA_HUB_URL}/${senderStorageId}/skhub/shared/${myPublicKey}/${SKYSPACE_PATH}${skyspaceName}.json`)
                            .then(res=>res.json());
    console.log(encryptedContent);
    const decryptedContent = await decryptContent(session, JSON.stringify(encryptedContent));
    console.log(decryptedContent);
}

// Add SkhubId to SkySpaces
export const addToSkySpaceList = (session, skyspaceName, skhubId) => {
    return getSkySpace(session, skyspaceName)
        .then((skyspaceObj) => {
            const SKYSPACE_FILEPATH = SKYSPACE_PATH + skyspaceName + '.json';
            skhubId = Array.isArray(skhubId) ? skhubId : [skhubId];
            skyspaceObj.skhubIdList = [...new Set([...skyspaceObj.skhubIdList, ...skhubId])];
            return putFile(session, SKYSPACE_FILEPATH, skyspaceObj);
        });
}

export const bsRemoveFromSkySpaceList = (session, skyspaceName, skhubId) => {
    return getSkySpace(session, skyspaceName)
        .then((skyspaceObj) => {
            if (skyspaceObj && skyspaceObj.skhubIdList.indexOf(skhubId) > -1) {
                const idx = skyspaceObj.skhubIdList.indexOf(skhubId);
                skyspaceObj.skhubIdList.splice(idx, 1);
                const SKYSPACE_FILEPATH = SKYSPACE_PATH + skyspaceName + '.json';
                return putFile(session, SKYSPACE_FILEPATH, skyspaceObj);
            } else {
                return FAILED;
            }
        })
        .catch(err => {
            return FAILED;
        });
}

export const getUserHistory = (session) => {
    return getFile(session, HISTORY_FILEPATH)
        .then((historyObj) => {
            if (historyObj == null) {
                return [];
            } else if (historyObj && historyObj.name === FAILED_DECRYPT_ERR) {
                return deleteFile(session, HISTORY_FILEPATH)
                    .then(() => []);
            } else {
                return historyObj;
            }
        })
        .catch(err => []);
}


export const bsAddToHistory = async(session, obj) => {
    return getUserHistory(session)
        .then(userHistoryObj => {
            if (userHistoryObj == null) {
                userHistoryObj = [];
            }
            obj.timestamp = new Date();
            //userHistoryObj.push(obj);
            //Need to check if Object already exist in history with skhubId as null or empty
            const idx = userHistoryObj.findIndex(objInList => {
                let isEqual = false;
                // if (objInList.hasOwnProperty("savedToSkySpaces") &&
                //     objInList["skhubId"] &&
                //     (objInList["skhubId"] === obj["skhubId"]) &&
                //     (objInList["savedToSkySpaces"] === false) &&
                //     (objInList["skyspaces"].length === 0)) {
                //     isEqual = true;
                // }
                if (objInList.skhubId && (objInList.skhubId === obj.skhubId))
                {
                    isEqual = true;
                }
                return isEqual;
            });
            if (idx > -1) {
                userHistoryObj[idx].savedToSkySpaces = obj.savedToSkySpaces;
                userHistoryObj[idx].skyspaces = obj.skyspaces;
            }
            else {
                userHistoryObj.push(obj);
            }
            return userHistoryObj;
        })
        .then(userHistoryObj => {
            return putFile(session, HISTORY_FILEPATH, userHistoryObj);
        })
        .catch(err => {
            return err;
        });
}

export const bsSetHistory = async (session, historyJsonObj) => {
    await putFile(session, HISTORY_FILEPATH,historyJsonObj);
    return ;
}

export const bsClearHistory = async (session) => {
    await putFile(session, HISTORY_FILEPATH, []);
    return;
}

export const bsGetUserSetting = async (session) => {
    const userSetting = await getFile(session, USERSETTINGS_FILEPATH);
    return userSetting ? userSetting : INITIAL_SETTINGS_OBJ();
}

export const bsSetUserSetting = async (session, userSettingObj) => {
    await putFile(session, USERSETTINGS_FILEPATH, userSettingObj);
    return;
}

export const bsGetPortalsList = async (session) => {
    let portalsJSON = await getFile(session, SKYNET_PORTALS_FILEPATH);
    if (portalsJSON == null) {
        portalsJSON = INITIAL_PORTALS_OBJ
    }
    else if (portalsJSON.portals == null || portalsJSON.portals.length === 0) {
        portalsJSON.portals = INITIAL_PORTALS_OBJ.portals;
    }
    return portalsJSON;
}

export const bsSetPortalsList = async (session, portalsObj) => {
    await putFile(session, SKYNET_PORTALS_FILEPATH, portalsObj);
    return;
}

export const bsDeletePortal = (session, portalName) => {
    return bsGetPortalsList(session)
        .then((portalsListObj) => {
            if (portalsListObj == null) {
                portalsListObj = [];
            }
            const idx = portalsListObj.findIndex(portalObj =>
                (portalObj.hasOwnProperty("name") && portalObj["name"] === portalName));
            if (idx > -1) {
                portalsListObj.splice(idx, 1);
            }
            return portalsListObj;
        })
        .then((portalsListObj) => putFile(session, SKYNET_PORTALS_FILEPATH, portalsListObj))
        .catch(err => {
            return err;
        });
}

export const bsAddPortal = (session, obj) => {
    return bsGetPortalsList(session)
        .then(portalsListObj => {
            if (portalsListObj == null) {
                portalsListObj = [];
            }
            obj.createTS = new Date();
            portalsListObj.portals.push(obj);
            return portalsListObj;
        })
        .then(portalsListObj => {
            return putFile(session, SKYNET_PORTALS_FILEPATH, portalsListObj);
        })
        .catch(err => {
            return err;
        });
}

export const bsGetBackupObjFile = async (session) => {
    const filePathList = await listFiles(session);
    const promises = [];
    const backupObjList = [];
    filePathList.forEach(filePath=>{
        IGNORE_PATH_IN_BACKUP.indexOf(filePath)===-1 &&  promises.push(getFile(session, filePath)
            .then((content)=> {
                const backupObj = {
                    path: filePath,
                    contentStr: JSON.stringify(content)
                };
                backupObjList.push(backupObj);
            }))
    });
    await Promise.all(promises);
    const encryptedContent = await encryptContent(session,JSON.stringify(backupObjList));
    return new File([encryptedContent], "backup"+new Date()+".txt", {type: "text/plain", lastModified: new Date()});
}

export const retrieveBackupObj = async (session, skylinkUrl)=> {
    const res = await fetch(skylinkUrl);
    const txt = await res.text();
    const decryptedTxt = await decryptContent(session, txt);
    return JSON.parse(decryptedTxt);
}

export const restoreBackup = async (session, backupObj) =>{
    const promises = [];
    const currentfilePathList = await listFiles(session);
    backupObj.forEach((obj, idx)=>{
        if (IGNORE_PATH_IN_BACKUP.indexOf(obj.path)===-1) {
            if (currentfilePathList && currentfilePathList.indexOf(obj.path)>-1){
                currentfilePathList.splice(currentfilePathList.indexOf(obj.path), 1);
            } 
           promises.push(putFile(session, obj.path, JSON.parse(obj.contentStr)))
        }
    });
    currentfilePathList.forEach((path)=>{
        IGNORE_PATH_IN_BACKUP.indexOf(path)===-1 && promises.push(deleteFile(session, path));
    })
    await Promise.all(promises);
    return SUCCESS;
}

export const bsSavePublicKey = async (session) => {
    let publicKey = null;
    try {
        publicKey = await getFile(session, PUBLIC_KEY_PATH, { decrypt: false });
        if (publicKey ==null){
           publicKey = getPublicKeyFromPrivate(session.loadUserData().appPrivateKey);
           await putFile(session, PUBLIC_KEY_PATH, publicKey, { encrypt: false});
        }
    } catch(err) {
        console.log(err);
    }
}

export const bsGetSharedWithObj = async (session) => {
    return getFile(session, SHARED_WITH_FILE_PATH);
}

export const bsShareSkyspace = async (session, skyspaceName, recipientId) => {
    console.log(session, skyspaceName, recipientId);
    const key = await fetch(`${GAIA_HUB_URL}/${recipientId}/${PUBLIC_KEY_PATH}`).then(res=>res.json());
    const sharedWithObj = (await bsGetSharedWithObj(session)) || {};
    sharedWithObj[recipientId] = sharedWithObj[recipientId] ?? {};
    sharedWithObj[recipientId]["spaces"] = sharedWithObj[recipientId]["spaces"] ?? [];
    sharedWithObj[recipientId]["skylinks"] = sharedWithObj[recipientId]["skylinks"] ?? [];
    if (sharedWithObj[recipientId]["spaces"].indexOf(skyspaceName) === -1) {
        const recipientPathPrefix = SHARED_PATH_PREFIX + recipientId + "/";
        sharedWithObj[recipientId]["spaces"].push(skyspaceName);
        
        const sharedSkyspaceIdxObj = createSkySpaceIdxObject();
        sharedSkyspaceIdxObj.skyspaceList = sharedWithObj[recipientId]["spaces"];
        const encSharedSkyspaceIdxObj = await encryptContent(session, JSON.stringify(sharedSkyspaceIdxObj), {publicKey: key});
        const SHARED_SKYSPACE_IDX_FILEPATH = recipientPathPrefix + SKYSPACE_IDX_FILEPATH;
        await putFileForShared(session, SHARED_SKYSPACE_IDX_FILEPATH, encSharedSkyspaceIdxObj);
        
        const skyspaceObj = await getSkySpace(session, skyspaceName);
        const encSkyspaceObj = await encryptContent(session, JSON.stringify(skyspaceObj), {publicKey: key});
        const SHARED_SKYSPACE_FILEPATH = recipientPathPrefix + SKYSPACE_PATH + skyspaceName + '.json';
        await putFileForShared(session, SHARED_SKYSPACE_FILEPATH, encSkyspaceObj);
        
        sharedWithObj[recipientId]["skylinks"] = [...new Set([...sharedWithObj[recipientId]["skylinks"], ...skyspaceObj.skhubIdList])];
  
        const sharedSkylinkIdxObj = createSkylinkIdxObject();
        sharedSkylinkIdxObj.skhubIdList = sharedWithObj[recipientId]["skylinks"];
        const encSharedSkylinkIdxObj = await encryptContent(session, JSON.stringify(sharedSkylinkIdxObj), {publicKey: key});
        const SHARED_SKYLINK_IDX_FILEPATH = recipientPathPrefix + SKYLINK_IDX_FILEPATH;
        await putFileForShared(session, SHARED_SKYLINK_IDX_FILEPATH, encSharedSkylinkIdxObj);
        
        const arrSkylinkInSkyspace = await getSkyspaceApps(session, skyspaceName);
        console.group();
        arrSkylinkInSkyspace.forEach(async (skylink, i)=>{
            const encSkylink = await encryptContent(session, JSON.stringify(skylink), {publicKey: key});
            console.log(i, skylink, encSkylink);
            // TODO: upload skylink object
        })
        console.groupEnd();
        console.log(sharedWithObj, skyspaceObj, arrSkylinkInSkyspace);
    }

}
