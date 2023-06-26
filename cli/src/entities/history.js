import fs from 'fs';
import _ from 'lodash';
import _package from '../../package.json' assert { type: 'json' };

/*
 * History
 * Describes a history pointer to previous published content
 * @property {string} version - The version of the history
 * @property {string} contract - The address of the contract
 * @property {post[]} posts - The posts in the history
 */
export default class History {
  // previos_history_cid = '';
  // previous_manifest_cid = '';
  previous_root_cid = '';
  version = _package.version;

  constructor() {}

  static async fromFile(path) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(JSON.parse(data));
      });
    });
  }
}
