import { ajax } from 'rxjs/ajax';

export const API_ROOT = process.env.REACT_APP_APPSTORE_HOST;
export const getAppList = (opt)=>ajax.getJSON(API_ROOT +"?limit=100&category="+opt);
export const getSkyAppList = (opt)=>ajax.getJSON(API_ROOT +"?limit=100&skyspace="+opt);
export const fetchSkyAppDetails = (skyAppId)=>ajax.getJSON(API_ROOT + skyAppId);
export const createSkapp = (skapp)=>ajax({
    url: API_ROOT,
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(skapp)
  })
  export const editSkapp = (skapp)=>ajax({
    url: API_ROOT+skapp.id,
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(skapp)
  });
  export const deleteSkapp = (skapp)=>ajax({
    url: API_ROOT+skapp.id/* +"/"+skapp.auth_code */,
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(skapp)
  })