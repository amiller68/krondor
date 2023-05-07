// Upload a file to IPFS through our Infura Endpoint

const path = require('path');
const axios = require('axios');
const dotenv = require('dotenv');
const endpoint = 'https://ipfs.infura.io:5001';
const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');
const { encode } = require('querystring');

dotenv.config({ path: path.resolve(__dirname, '../../env/ipfs.env') });

const pinFile = (_path) => {
  const formData = new FormData();
  formData.append('file', fs.createReadStream(_path));

  // const encodedCreds = Buffer.from(`${process.env.API_KEY}:${process.env.API_SECRET}`).toString('base64');

  // console.log("Credentials: ", encodedCreds)
  const url = `${endpoint}/api/v0/add?pin=1&cid-version=1`;
  const options = {
    auth: {
      username: process.env.API_KEY,
      password: process.env.API_SECRET
    }
  };
  return axios.post(url, formData, options).then((res) => {
    return res.data.Hash
  }).catch((err) => {
    // console.error('Error pinning file to IPFS:', err);
    throw err;
  });
  


  // return await fetch(`${endpoint}/api/v0/add?pin=1&cid-version=1`, {
  //   method: 'POST',
  //   body: formData,
  //   headers: {
  //   // 'Authorization': `Basic ${encodedCreds}`,

  //     '-u': `${process.env.API_KEY}:${process.env.API_SECRET}`
  //   },
  // })
  //   .then((res) => res.json())
  //   .then((data) => {
  //     console.log('File pinned to IPFS');
  //     console.log('IPFS CID:', data);
  //     return res
  //   })
  //   .catch((err) => {
  //     // console.error('Error pinning file to IPFS:', err);
  //     throw err;
  //   });
};

module.exports = { pinFile };
