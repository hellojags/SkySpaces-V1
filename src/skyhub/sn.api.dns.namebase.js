import fetch  from 'node-fetch';

const ACCESS_KEY = '';
const SECRET_KEY = '';
const credentials = Buffer.from(`${ACCESS_KEY}:${SECRET_KEY}`);
const encodedCredentials = credentials.toString('base64');
const authorization = `Basic ${encodedCredentials}`;

const credentials = Buffer.from(`${ACCESS_KEY}:${SECRET_KEY}`);
const encodedCredentials = credentials.toString('base64');
const authorization = `Basic ${encodedCredentials}`;

export async function get(endpoint, body = null) {
  const options = {
    method: 'GET',
    headers: {
      Authorization: authorization,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
  const url = `https://namebase.io${endpoint}`;
  return fetch(url, options)
    .then(res => res.json())
    .catch(err => err);
}

export async function put(endpoint, body) {
  const options = {
    method: 'PUT',
    body: body,
    headers: {
      Authorization: authorization,
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  };
  const url = `https://namebase.io${endpoint}`;
  return fetch(url, options)
    .then(res => res.json())
    .catch(err => err);
}

//  async function main() {
//    const args = process.argv.slice(2);

//    let func, path, data;

//    const domain = args[2];

//    if (args[0] === 'get') {
//      func = get;
//    } else if (args[0] === 'put') {
//      func = put;

//      if (args.length < 4) throw new Error('Put requires 4 arguments');

//      data = args[3];
//    } else {
//      throw new Error("Method should be either 'get' or 'put'");
//    }

//    if (args[1] === 'blockchain') {
//      path = `/api/v0/dns/domains/${domain}`;
//    } else if (args[1] === 'blockchain-advanced') {
//      path = `/api/v0/dns/domains/${domain}/advanced`;
//    } else if (args[1] === 'nameserver') {
//      path = `/api/v0/dns/domains/${domain}/nameserver`;
//    } else {
//      throw new Error("Service should be 'blockchain', 'blockchain-advanced' or 'nameserver'");
//    }

//    return func(path, data);
//  }

//  main().then(res => {
//    console.log(res);
//  });