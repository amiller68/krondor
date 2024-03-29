import axios from 'axios';
import fs from 'fs';
import path from 'path';
import FormData from 'form-data';
import Path from 'path';

export default class BlogIpfsClient {
  auth;
  endpoint;
  constructor(
    endpoint,
    options = {
      apiKey: undefined,
      apiSecret: undefined,
    }
  ) {
    this.endpoint = endpoint;
    this.auth = {
      username: options.apiKey,
      password: options.apiSecret,
    };
  }

  /*
   * Pin a file to IPFS
   * @param file_path The path to the file to pin
   * @returns The IPFS CID of the pinned file
   * @throws An error if the file could not be pinned
   */
  async pinFile(file_path) {
    const formData = new FormData();
    formData.append('file', fs.createReadStream(file_path));
    const url = `${this.endpoint}/api/v0/add?pin=1&cid-version=1`;
    return axios
      .post(url, formData, {
        auth: {
          ...this.auth,
        },
      })
      .then((res) => res.data.Hash)
      .catch((err) => {
        throw err;
      });
  }

  /*
   * Pull a block to a local file
   * @param cid The IPFS CID of the file to pull
   * @param file_path The path to the file to pull to
   * @throws An error if the file could not be pulled
   */
  async pullFile(cid, file_path) {
    const path = Path.resolve(file_path);
    const writer = fs.createWriteStream(path);
    // TODO: Make this pull a whole file or directory
    const url = `${this.endpoint}/api/v0/block/get?arg=${cid}`;
    return axios(url, {
      method: 'POST',
      responseType: 'stream',
      auth: {
        ...this.auth,
      },
    })
      .then((res) => {
        res.data.pipe(writer);
        return new Promise((resolve, reject) => {
          writer.on('finish', resolve);
          writer.on('error', reject);
        });
      })
      .catch((err) => {
        throw err;
      });
  }

  /*
   * Pin a directory to IPFS
   * @param dir_path The path to the directory to pin
   * @returns The IPFS CID of the pinned directory
   * @throws An error if the directory could not be pinned
   */
  async pinDirectory(dir_path) {
    const formData = new FormData();
    // Iterate through the files in the directory
    const files = fs.readdirSync(dir_path);
    for (const file of files) {
      // Add each file to the form data
      const file_path = path.join(dir_path, file);
      formData.append(file, fs.createReadStream(file_path));
    }
    const url = `${this.endpoint}/api/v0/add?pin=1&recursive=1&cid-version=1&wrap-with-directory=1`;
    return axios
      .post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        auth: {
          ...this.auth,
        },
      })
      .then(async (res) => {
        const data_str = await res.data;
        return data_str.split('\n').map((line) => {
          if (line === '') {
            return;
          }
          return JSON.parse(line);
        });
      })
      .catch((err) => {
        throw err;
      });
  }
}
