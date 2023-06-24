import fs from 'fs';
import { CID } from 'multiformats/cid';
import * as raw from 'multiformats/codecs/raw';
import { sha256 } from 'multiformats/hashes/sha2';

export default class Post {
  constructor() {
    this.name = '';
    this.cid = '';
    this.title = '';
    this.date = '';
  }

  static fromFile(_path, title = '') {
    return new Promise((resolve, reject) => {
      fs.readFile(_path, async (err, data) => {
        if (err) {
          reject(err);
        }

        const hash = await sha256.digest(data);
        const cid = CID.create(1, raw.code, hash).toString();
        const name = _path.split('/').pop();
        const date = new Date().toISOString();
        resolve({
          name,
          cid,
          title,
          date,
        });
      });
    });
  }
}

// module.exports = Post;
