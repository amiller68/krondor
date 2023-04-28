// Upload a file to IPFS through our Infura Endpoint

const path = require('path');
const dotenv = require('dotenv');
const endpoint = 'https://ipfs.infura.io:5001';
const fs = require('fs');
const FormData = require('form-data');
const fetch = require('node-fetch');

dotenv.config({ path: path.resolve(__dirname, '../../env/ipfs.env') });

const pinFile = (_path) => {
  const formData = new FormData();
  formData.append('file', fs.createReadStream(_path));

  return fetch(`${endpoint}/api/v0/add?pin=1&cid-version=1`, {
    method: 'POST',
    body: formData,
    headers: {
      Authorization:
        'Basic ' +
        Buffer.from(
          `${process.env.API_KEY}:${process.env.API_SECRET}`
        ).toString('base64'),
    },
  })
    .then((res) => res.json())
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.error('Error pinning file to IPFS:', err);
    });
};

module.exports = { pinFile };
