import { createSkySpaceIdxObject, SHARED_BY_USER_FILEPATH } from './constants'
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
import { lookupProfile } from "blockstack";
import {
    getFile,
    putFile,
    deleteFile,
    generateSkyhubId,
    listFiles,
    encryptContent,
    decryptContent,
    putFileForShared,
    getFileUsingPublicKeyStr
} from './utils'
import { BLOCKSTACK_CORE_NAMES, ID_PROVIDER_BLOCKSTACK, ID_PROVIDER_SKYDB } from '../sn.constants';
import { getUserSessionType } from '../sn.util';
import { snKeyPairFromSeed, snSerializeSkydbPublicKey } from '../skynet/sn.api.skynet';

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
};

export const bsAddBulkSkyspace = async (session, skyspaceList) => {
    const promises = [];
    skyspaceList.map((space) => {
        const skyspaceObj = createSkySpaceObject();
        skyspaceObj.skyspace = space;
        const SKYSPACE_FILEPATH = SKYSPACE_PATH + space + ".json";
        promises.push(putFile(session, SKYSPACE_FILEPATH, skyspaceObj));
    });
    await Promise.all(promises);
    let skyspaceIdxObj = await getFile(session, SKYSPACE_IDX_FILEPATH);
    skyspaceIdxObj = skyspaceIdxObj || createSkySpaceIdxObject();
    skyspaceIdxObj.skyspaceList = [...new Set([...skyspaceIdxObj.skyspaceList, ...skyspaceList])];
    await putFile(session, SKYSPACE_IDX_FILEPATH, skyspaceIdxObj);
};

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
                    .then(skyspaceObj => {
                        if (skyspaceObj != null && skyspaceObj.skhubIdList != null) {
                            skyspaceAppCountObj[skyspaceName] = skyspaceObj.skhubIdList.length;
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
    skyspaceList.forEach(skyspaceName => {
        promises.push(getSkySpace(session, skyspaceName)
            .then(skyspaceObj => {
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

//not in use
// export const bsGetSharedSkyspaceIdxFromSender = async (session, senderStorageId, skyspaceName) => {
//     const myPublicKey = getPublicKeyFromPrivate(session.loadUserData().appPrivateKey);
//     const encryptedContent = await fetch(`${GAIA_HUB_URL}/${senderStorageId}/skhub/shared/${myPublicKey}/${SKYSPACE_PATH}${skyspaceName}.json`)
//         .then(res => res.json());
//     const decryptedContent = await decryptContent(session, JSON.stringify(encryptedContent));
// }

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


export const bsAddToHistory = async (session, obj) => {
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
                if (objInList.skhubId && (objInList.skhubId === obj.skhubId)) {
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
    await putFile(session, HISTORY_FILEPATH, historyJsonObj);
    return;
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
    filePathList.forEach(filePath => {
        IGNORE_PATH_IN_BACKUP.indexOf(filePath) === -1 && promises.push(getFile(session, filePath)
            .then((content) => {
                const backupObj = {
                    path: filePath,
                    contentStr: JSON.stringify(content)
                };
                backupObjList.push(backupObj);
            }))
    });
    await Promise.all(promises);
    const encryptedContent = await encryptContent(session, JSON.stringify(backupObjList));
    return new File([encryptedContent], "backup" + new Date() + ".txt", { type: "text/plain", lastModified: new Date() });
}

export const retrieveBackupObj = async (session, skylinkUrl) => {
    const res = await fetch(skylinkUrl);
    const txt = await res.text();
    const decryptedTxt = await decryptContent(session, txt);
    return JSON.parse(decryptedTxt);
}

export const restoreBackup = async (session, backupObj) => {
    const promises = [];
    const currentfilePathList = await listFiles(session);
    backupObj.forEach((obj, idx) => {
        if (IGNORE_PATH_IN_BACKUP.indexOf(obj.path) === -1) {
            if (currentfilePathList && currentfilePathList.indexOf(obj.path) > -1) {
                currentfilePathList.splice(currentfilePathList.indexOf(obj.path), 1);
            }
            promises.push(putFile(session, obj.path, JSON.parse(obj.contentStr)))
        }
    });
    currentfilePathList.forEach((path) => {
        IGNORE_PATH_IN_BACKUP.indexOf(path) === -1 && promises.push(deleteFile(session, path));
    })
    await Promise.all(promises);
    return SUCCESS;
}

export const bsClearStorage = async (session) => {
    const promises = [];
    await listFiles(session)
    .then(filePathList=>filePathList.forEach(path=>promises.push(deleteFile(session, path))));
    await Promise.all(promises);
}

export const bsSavePublicKey = async (session) => {
    let publicKey = null;
    try {
        publicKey = await getFile(session, PUBLIC_KEY_PATH, { decrypt: false });
        if (publicKey == null) {
            publicKey = getPublicKeyFromPrivate(session.loadUserData().appPrivateKey);
            await putFile(session, PUBLIC_KEY_PATH, publicKey, { encrypt: false });
        }
    } catch (err) {
        console.log(err);
    }
}

export const bsGetSharedWithObj = async (session) => {
    try {
        return getFile(session, SHARED_WITH_FILE_PATH);
    } catch (e) { }
}

export const bsSaveSharedWithObj = async (session, sharedWithObj) => {
    return putFile(session, SHARED_WITH_FILE_PATH, sharedWithObj);
}
// This method is getting called from Modal to import user spaces.
export const importSpaceFromUserList = async (session, senderIdList) => bsGetSpacesFromUserList(session, senderIdList, { isImport: true });

//TODO: This method pulls ALL shared spaces by ALL senders. Its using senders (sender's storage path) / (in case of skyDB sender's public key) to pull this data
export const bsGetSpacesFromUserList = async (session, senderIdList, opt) => {
    const promises = [];
    const senderListWithNoShare = [];
    // get existing shared spaces data. senderList and sender-space mapping
    const sharedByUserObj = opt.sharedByUserObj || (await bsGetSharedByUser(session));
    let { senderToSpacesMap={}, sharedByUserList=[] } = sharedByUserObj || {};
    senderIdList && senderIdList.forEach(async senderId => {
        const sessionType = getUserSessionType(session);
        let loggedInUserStorageId, sharedSpaceIdxPromise;
        switch(sessionType){
            case ID_PROVIDER_SKYDB:
                loggedInUserStorageId = snSerializeSkydbPublicKey(snKeyPairFromSeed(session.skydbseed).publicKey);
                sharedSpaceIdxPromise = bsGetShrdSkyspaceIdxFromSender(session, senderId, loggedInUserStorageId);
                break;
            case ID_PROVIDER_BLOCKSTACK:
            default:
                const loggedInUserProfile = JSON.parse(localStorage.getItem('blockstack-session')).userData?.profile;
                loggedInUserStorageId = bsGetProfileInfo(loggedInUserProfile).storageId;
                sharedSpaceIdxPromise = lookupProfile(senderId, BLOCKSTACK_CORE_NAMES)
                .then(senderProfile => {
                    // get sender's storage location
                    const senderStorage = bsGetProfileInfo(senderProfile).storage;
                    // get SkyspacesIDX object from senders storage location. in case of SkyDB. storageId is basically PublicKey, and path is DataKey
                    return bsGetShrdSkyspaceIdxFromSender(session, senderStorage, loggedInUserStorageId);
                });
        }
        const promise = sharedSpaceIdxPromise
            .then(sharedSpaceIdxObj => {
                senderToSpacesMap[senderId] = sharedSpaceIdxObj;
                sharedByUserList.indexOf(senderId) === -1 && sharedByUserList.push(senderId);
            })
            .catch(err => {
                console.log(err);
                senderListWithNoShare.push(senderId);
            })
        promises.push(promise);
    });
    await Promise.all(promises);
    opt?.isImport && await putFile(session, SHARED_BY_USER_FILEPATH, {
        sharedByUserList,
        senderToSpacesMap
    });
    return {
        sharedByUserList,
        senderToSpacesMap
    };
}
//Sharing functionality: This method is fetching "all SHARED skylink JSON objects" from sender storage.
// For SkyDB, we will only need "Public Key" of "sender" and "DataKey" of shared Object
//1. NO STORAGE ID logic required for skyDB, Since we just need "public Key" and "dataKey" of sender to fetch data
//2. With SKYDB , Sender will need to create one entry in skydb while sharing with other user. DataKey["receiver's pubkey"] -> "list of all files shared by sender. key of ...spaceIDX, skylinkindex, skhub.json "
//3. receiver when imports "senders pubKey", he will be able to fetch complete list by doing getJSON(sender's PubKey, dataKey[receiver(or loggedin user) PubKey] ). You will get list of all files.
//4. Now receiver will be able to fetch each files using  "senders pubKey" and file path from file fetched in steps #3

// OR

// You can use Public key instead of stoarge ID.

export const bsGetSharedSpaceAppList = async (session, senderId, skyspace) => {
    //for skyDB we can do IF consition here
    // if (skydb)
    // {
    //     call skyDbGetSharedSpaceAppList()
    // }else
    // { below
    let {senderStorage, loggedInUserStorageId} = await getStorageIds(session, senderId);
    const SHARED_SKYSPACE_FILEPATH = SHARED_PATH_PREFIX + loggedInUserStorageId + "/" + SKYSPACE_PATH + skyspace + '.json';
    const encSkyspaceObj = await getEncDataFromSenderStorage(session, SHARED_SKYSPACE_FILEPATH, senderStorage);//await fetch(`${senderStorage}${SHARED_SKYSPACE_FILEPATH}`).then(res => res.json());
    const skyspaceObj = JSON.parse(await decryptContent(session, JSON.stringify(encSkyspaceObj)));
    const promises = [];
    const skylinkArr = [];
    const loop = skyspaceObj?.skhubIdList.map(skhubId => {
        const SHARED_SKYLINK_FILE_PATH = SHARED_PATH_PREFIX + loggedInUserStorageId + "/" + SKYLINK_PATH + skhubId + ".json";
        promises.push( getEncDataFromSenderStorage(session, SHARED_SKYLINK_FILE_PATH, senderStorage) 
            .then(encSkylinkObj => decryptContent(session, JSON.stringify(encSkylinkObj)))
            .then(skylinkObjStr => {
                skylinkArr.push(JSON.parse(skylinkObjStr))
            }))
    });
    await Promise.all(promises);
    return skylinkArr;
}

export const getEncDataFromSenderStorage = async (session, filePath, senderStorage)=> {
    const sessionType = getUserSessionType(session);
    let encSharedSkyspaceIdx;
    switch (sessionType) {
        case ID_PROVIDER_SKYDB:
            encSharedSkyspaceIdx = await getFileUsingPublicKeyStr(senderStorage,filePath);
            break;
        case ID_PROVIDER_BLOCKSTACK:
        default:
            encSharedSkyspaceIdx = await fetch(`${senderStorage}${filePath}`).then(res => res.json());
    }
    return encSharedSkyspaceIdx;
}

export const getStorageIds = async (session, senderId) => {
    const sessionType = getUserSessionType(session);
    let senderStorage, loggedInUserStorageId, remoteUserStorage;
    switch (sessionType) {
        case ID_PROVIDER_SKYDB:
            loggedInUserStorageId = snSerializeSkydbPublicKey(snKeyPairFromSeed(session.skydbseed).publicKey);
            senderStorage = senderId;
            remoteUserStorage =  senderId;
            break;
        case ID_PROVIDER_BLOCKSTACK:
        default:
            const loggedInUserProfile = JSON.parse(localStorage.getItem('blockstack-session')).userData?.profile;
            loggedInUserStorageId = bsGetProfileInfo(loggedInUserProfile).storageId;
            const senderProfile = await lookupProfile(senderId, BLOCKSTACK_CORE_NAMES);
            senderStorage = bsGetProfileInfo(senderProfile).storage;
            remoteUserStorage = bsGetProfileInfo(senderProfile).storageId;
    }
    return {
        loggedInUserStorageId,
        senderStorage,
        remoteUserStorage,
        sessionType
    }
}

// get {senderToSpacesMap={}, sharedByUserList=[]} in sharedByUserObj
export const bsGetImportedSpacesObj = async (session, opt={}) => {
    // reading a file containing shared spaces information. senders information.
    // can we now directly read all data from below method? do we need to call bsGetSpacesFromUserList ?? 
    const sharedByUserObj = await bsGetSharedByUser(session);
    opt["sharedByUserObj"] = sharedByUserObj;
    return bsGetSpacesFromUserList(session, sharedByUserObj?.sharedByUserList, opt);
};

export const bsGetSharedByUser = async (session) => {
    let sharedByUserObj = await getFile(session, SHARED_BY_USER_FILEPATH);
    return sharedByUserObj;
}

export const bsGetShrdSkyspaceIdxFromSender = async (session, senderStorage, loggedInUserStorageId) => {
    const SHARED_SKYSPACE_IDX_FILEPATH = SHARED_PATH_PREFIX + loggedInUserStorageId + '/' + SKYSPACE_IDX_FILEPATH;
    let encSharedSkyspaceIdx = await getEncDataFromSenderStorage(session, SHARED_SKYSPACE_IDX_FILEPATH, senderStorage);
    const sharedSkyspaceIdx = await decryptContent(session, JSON.stringify(encSharedSkyspaceIdx));
    return JSON.parse(sharedSkyspaceIdx);
}

export const bsGetSharedSkappListFromSender = async (session, senderId, skhubIdList) => {
    let {senderStorage, loggedInUserStorageId} = await getStorageIds(session, senderId);
    const skappList = [];
    const promises = [];
    skhubIdList.forEach(skhubId => {
        const SHARED_SKYLINK_PATH = SHARED_PATH_PREFIX + loggedInUserStorageId + "/" + SKYLINK_PATH + skhubId + ".json";
        promises.push(getEncDataFromSenderStorage(session, SHARED_SKYLINK_PATH, senderStorage)
            .then(encSharedSkapp => decryptContent(session, JSON.stringify(encSharedSkapp)))
            .then(sharedSkappStr => {
                skappList.push(JSON.parse(sharedSkappStr))
            }));
    })
    await Promise.all(promises);
    return skappList;
}


export const bsSetSharedSkylinkIdx = async (session, recipientId, skylinkList, sharedWithObj) => {
    const sharedSkylinkIdxObj = createSkylinkIdxObject();
    const recipientPathPrefix = SHARED_PATH_PREFIX + recipientId + "/";
    let publicKey;
    const sessionType = getUserSessionType(session);
    switch(sessionType){
        case ID_PROVIDER_SKYDB:
            publicKey = recipientId;
            break;
        case ID_PROVIDER_BLOCKSTACK:
        default:
            const profile = await lookupProfile(sharedWithObj[recipientId].userid, BLOCKSTACK_CORE_NAMES);
            publicKey = profile?.appsMeta?.[document.location.origin]?.publicKey
    }
    sharedSkylinkIdxObj.skhubIdList = skylinkList;
    const encSharedSkylinkIdxObj = await encryptContent(session, JSON.stringify(sharedSkylinkIdxObj), {
        publicKey
    });
    const SHARED_SKYLINK_IDX_FILEPATH = recipientPathPrefix + SKYLINK_IDX_FILEPATH;
    await putFileForShared(session, SHARED_SKYLINK_IDX_FILEPATH, encSharedSkylinkIdxObj);
}

export const bsGetProfileInfo = (profile) => {
    const recipientIdStr = (profile?.appsMeta?.[document.location.origin]?.storage?.replace(GAIA_HUB_URL, ""))?.replace("/", "");
    const recipientId = recipientIdStr?.replace("/", "");
    return {
        key: profile?.appsMeta?.[document.location.origin]?.publicKey,
        storage: profile?.appsMeta?.[document.location.origin]?.storage,
        storageId: recipientId
    };
}

export const bsUnshareSpaceFromRecipientLst = async ( session, recipientIdStrgLst, skyspaceName, sharedWithObj ) => {
    const promises = []
    const rslt = recipientIdStrgLst?.map(recipientIdStrg => {
        promises.push(getStorageIds(session, sharedWithObj[recipientIdStrg].userid)
            .then(storageObj=>storageObj.remoteUserStorage)
            .then(recipientStorage=>{
                const recipientPathPrefix = SHARED_PATH_PREFIX + recipientStorage + "/";
                const SHARED_SKYSPACE_FILEPATH = recipientPathPrefix + SKYSPACE_PATH + skyspaceName + '.json';
                return deleteFile(session, SHARED_SKYSPACE_FILEPATH)
        })
        .then(()=>bsShareSkyspace(session, sharedWithObj[recipientIdStrg]["spaces"], sharedWithObj[recipientIdStrgLst].userid), sharedWithObj)
        );
    });
    await Promise.all(promises);
}

//const getBlockStackIdList = (sharedWithObjKeyLst) => sharedWithObjKeyLst.map(sharedWithObjKey=> props.sharedWithObj[sharedWithObjKey].userid);

export const bsShareSkyspace = async (session, skyspaceList, blockstackId, sharedWithObj) => {
    let recipientId;
    let key;
    const sessionType = getUserSessionType(session);
    switch(sessionType){
        case ID_PROVIDER_SKYDB:
            recipientId = blockstackId;
            key = blockstackId;
            break;
        case ID_PROVIDER_BLOCKSTACK:
        default:
            // blockstackId='block_antares_va.id.blockstack';
            const profile = await lookupProfile(blockstackId, BLOCKSTACK_CORE_NAMES);
            // const key = await fetch(`${GAIA_HUB_URL}/${recipientId}/${PUBLIC_KEY_PATH}`).then(res=>res.json());
            key = profile?.appsMeta?.[document.location.origin]?.publicKey;
            const recipientIdStr = (profile?.appsMeta?.[document.location.origin]?.storage?.replace(GAIA_HUB_URL, ""))?.replace("/", "");
            recipientId = recipientIdStr?.replace("/", "");
            if (key == null || recipientId == null) {
                console.log("User not setup for skyspace");
                throw "User not setup for skyspace";
            }
    }
    if (sharedWithObj == null) {
        sharedWithObj = (await bsGetSharedWithObj(session)) || {};
    }
    sharedWithObj[recipientId] = sharedWithObj[recipientId] ?? {};
    sharedWithObj[recipientId]["userid"] = blockstackId;
    sharedWithObj[recipientId]["spaces"] = sharedWithObj[recipientId]["spaces"] ?? [];
    sharedWithObj[recipientId]["skylinks"] = sharedWithObj[recipientId]["skylinks"] ?? [];
    const recipientPathPrefix = SHARED_PATH_PREFIX + recipientId + "/";
    sharedWithObj[recipientId]["spaces"] = [...new Set([...sharedWithObj[recipientId]["spaces"], ...skyspaceList])];

    const sharedSkyspaceIdxObj = createSkySpaceIdxObject();
    sharedSkyspaceIdxObj.skyspaceList = sharedWithObj[recipientId]["spaces"];
    const encSharedSkyspaceIdxObj = await encryptContent(session, JSON.stringify(sharedSkyspaceIdxObj), { publicKey: key });
    const SHARED_SKYSPACE_IDX_FILEPATH = recipientPathPrefix + SKYSPACE_IDX_FILEPATH;
    await putFileForShared(session, SHARED_SKYSPACE_IDX_FILEPATH, encSharedSkyspaceIdxObj);

    const promises = [];
    const skhubIdList = [];
    skyspaceList.map((skyspaceName) => {
        const SHARED_SKYSPACE_FILEPATH = recipientPathPrefix + SKYSPACE_PATH + skyspaceName + '.json';
        promises.push(getSkySpace(session, skyspaceName)
            .then(skyspaceObj => {
                skhubIdList.push(...skyspaceObj.skhubIdList);
                return encryptContent(session, JSON.stringify(skyspaceObj), { publicKey: key })
            })
            .then(encSkyspaceObj => putFileForShared(session, SHARED_SKYSPACE_FILEPATH, encSkyspaceObj)));
    });
    await Promise.all(promises);

    sharedWithObj[recipientId]["skylinks"] = [...new Set([...sharedWithObj[recipientId]["skylinks"], ...skhubIdList])];

    const sharedSkylinkIdxObj = createSkylinkIdxObject();
    sharedSkylinkIdxObj.skhubIdList = sharedWithObj[recipientId]["skylinks"];
    const encSharedSkylinkIdxObj = await encryptContent(session, JSON.stringify(sharedSkylinkIdxObj), { publicKey: key });
    const SHARED_SKYLINK_IDX_FILEPATH = recipientPathPrefix + SKYLINK_IDX_FILEPATH;
    await putFileForShared(session, SHARED_SKYLINK_IDX_FILEPATH, encSharedSkylinkIdxObj);

    promises.length = 0;
    [...new Set([...skhubIdList])].map((skhubId) => {
        const SHARED_SKYLINK_PATH = recipientPathPrefix + SKYLINK_PATH + skhubId + ".json";
        promises.push(getSkylink(session, skhubId)
            .then((skylink) => encryptContent(session, JSON.stringify(skylink), { publicKey: key }))
            .then((encSkylink) => putFileForShared(session, SHARED_SKYLINK_PATH, encSkylink)));
    });
    await Promise.all(promises);

    await bsSaveSharedWithObj(session, sharedWithObj);
}
