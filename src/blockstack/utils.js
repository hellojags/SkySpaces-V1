import crypto from 'crypto'

export function generateSkyhubId(inputStr)
{
  return crypto.createHash('sha256').update(inputStr+(new Date())).digest('base64').replace("/", "+");
}
export async function listFiles(session) {
  const pathList = [];
  await session.listFiles((res)=>{
    pathList.push(res);
    return true;
  })
  return pathList;
}
export async function encryptContent(session, content, options) {
  return await session.encryptContent(content, options)
}
export async function decryptContent(session, content, options) {
  return await session.decryptContent(content, options)
}
export function getFile(session, FILE_PATH, param)
{
    const options = {decrypt: param?.decrypt ?? true};
    return session.getFile(FILE_PATH, options)
    .then((content) => {
      if (content) {
          return JSON.parse(content)
      }
    })
    .catch(err =>{
      if (err.code==="does_not_exist"){
        return null;
      } else {
        return err;
      }
    })
}
// Replace file content with new "content"
export function putFile(session, FILE_PATH,content, param) {
    const options = {encrypt: param?.encrypt ?? true};
    if (content.hasOwnProperty("lastUpdateTS")){
      content.lastUpdateTS = new Date();
    }
    return session.putFile(FILE_PATH, JSON.stringify(content), options);
}

export function putFileForShared(session, FILE_PATH, encryptedContent) {
  return session.putFile(FILE_PATH, encryptedContent, {encrypt: false, dangerouslyIgnoreEtag: true});
}

// Replace file content with new "content"
export function deleteFile(session, FILE_PATH)
{
    const options = { encrypt: true }
    return session.deleteFile(FILE_PATH, options)
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
