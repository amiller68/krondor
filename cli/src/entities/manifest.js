import fs from 'fs';
import _ from 'lodash';
import _package from '../../package.json' assert { type: 'json' };

/*
 * Manifest
 * Describes posts and their metadata
 * @property {string} version - The version of the manifest
 * @property {string} contract - The address of the contract
 * @property {post[]} posts - The posts in the manifest
 */
export default class Manifest {
  posts = [];
  version = _package.version;
  contract = '';

  constructor(contract) {
    this.contract = contract;
    this.posts = [];
  }

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

export function addPost(manifest, post) {
  // Make sure each post has a path, title, cid, and date
  if (!post.name || !post.title || !post.cid || !post.date) {
    throw new Error('Post is missing required fields');
  }

  // Make sure the post doesn't already exist
  if (_.find(manifest.posts, { name: post.name })) {
    throw new Error('Post already exists');
  }

  manifest.posts = [...manifest.posts, post];
}

export function updatePost(manifest, post) {
  // Make sure each post has a path, title, cid, and date
  if (!post.name || !post.cid || !post.date) {
    throw new Error('Post is missing required fields');
  }

  // Make sure the post exists
  if (!_.find(manifest.posts, { name: post.name })) {
    throw new Error('Post does not exist');
  }

  manifest.posts = manifest.posts.map((p) => {
    if (p.name === post.name) {
      return {
        ...post,
        title: p.title,
      };
    }
    return p;
  });
}

export function removePost(manifest, name) {
  manifest.posts = manifest.posts.filter((p) => {
    return p.name !== name;
  });
}

export function getPost(manifest, path) {
  return _.find(manifest.posts, { path });
}
