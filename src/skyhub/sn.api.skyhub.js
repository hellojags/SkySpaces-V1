// Package to upload, download and delete(only link with HNS name, not actual data) data from decentralized storage 
// network (Skynet/Sia). Also It will allow to associate content reference with HandshakeName using namebase api.

import fetch from 'node-fetch';
import { SkynetClient } from "skynet-js";

const options = { 
    tld: "skyhub",
    dnsblockchain: "HNS",
    dnsservice: "nameserver", // location to update DNS record.
    dnsserviceapi: "https://www.namebase.io", //api to add and remove DNS records 
    dnsserviceapikey: "", 
    dnsserviceapisecret: "",
    dnsresolvergateway: "52.36.16.31", //Namebase Gateway to resolve DNS records. you can setup your own gateway and put that ip here.
    
    storageblockchain: "Sia",
    storageserviceapi: "https://siasky.net/", //Skynet sdk compliant portal api 
    
    skyhubendpoint: "https://skyspaces.io/api/hns/update" };

export const uploadData = async (domain,file,isDir,{}) =>
{
    const credentials = Buffer.from(`${options.dnsserviceapikey}:${options.dnsserviceapisecret}`);
    const encodedCredentials = credentials.toString('base64');
    const authorization = 'Basic '+ encodedCredentials;

    const temp = domain.substring(0,domain.lastIndexOf('.'))
    const tld = (temp) ?  domain.substring(domain.lastIndexOf('.')+1):temp;
    const subdomain= (temp) ? temp: tld;
    const portal = options.storageserviceapi;
    console.log(" skynet portal "+portal)
    console.log(" tld "+tld+" subdomain "+subdomain)
    let path="";
    if (options.dnsservice === 'blockchain') {
        path = `/api/v0/dns/domains/${tld}`;
      } else if (options.dnsservice === 'blockchain-advanced') {
        path = `/api/v0/dns/domains/${tld}/advanced`;
      } else if (options.dnsservice === 'nameserver') {
        path = `/api/v0/dns/domains/${tld}/nameserver`;
      } else {
        throw new Error("Service should be 'blockchain', 'blockchain-advanced' or 'nameserver'");
      }
    const url = options.dnsserviceapi+path;
    const dns_records ='{"records":[{ "type": "TXT", "host": "'+subdomain+'", "value": "TEST", "ttl": 60 }],"deleteRecords":[]}';
    const uploadedContent = await new SkynetClient(portal).upload(file);
    console.log("uploadedContent"+uploadedContent.json);
    //get skylink and put in JSON
    const nb_options = {
        method: 'PUT',
        // mode : 'no-cors', 
        body: dns_records,
        headers: {
        Authorization: authorization,
        Accept: 'application/json',
        'Content-Type': 'application/json',
        },
    };
    return fetch(url, nb_options)
        .then(res => {
            res.json();
            console.log(res.json());
            }
        )
        .catch(err => err)
};



export const getData = async (domain, uid, options) =>
{
    const credentials = Buffer.from(`${options.dnsserviceapikey}:${options.dnsserviceapisecret}`);
    const encodedCredentials = credentials.toString('base64');
    const authorization = `Basic ${encodedCredentials}`;

    const portal = options.storageendpoint;
    let path="";
    if (options.dnsservice === 'blockchain') {
        path = `/api/v0/dns/domains/${domain}`;
      } else if (options.dnsservice === 'blockchain-advanced') {
        path = `/api/v0/dns/domains/${domain}/advanced`;
      } else if (options.dnsservice === 'nameserver') {
        path = `/api/v0/dns/domains/${domain}/nameserver`;
      } else {
        throw new Error("Service should be 'blockchain', 'blockchain-advanced' or 'nameserver'");
      }
    const url = options.dnsserviceapi+path;
    
    const nb_options = {
        method: 'GET',
        headers: {
          Authorization: authorization,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      };
      return fetch(url, options)
        .then(res => {
            res.json();
            console.log(res.json());
        })
        .catch(err => err);

    return;
};

export const deleteData = async (domain, uid, options) =>
{
    return;
};