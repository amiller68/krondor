const fs = require('fs');
const _ = require('lodash');

const emptyManifest = (version) => {
  return {
    version: version,
    posts: [],
  };
};

const addPost = (manifest, post) => {
  // Make sure each post has a path, title, cid, and date
  if (!post.name || !post.title || !post.cid || !post.date) {
    throw new Error('Post is missing required fields');
  }

  // Make sure the post doesn't already exist -- _
  if (_.find(manifest.posts, { name: post.name })) {
    throw new Error('Post already exists');
  }

  manifest.posts.push(post);
  return manifest;
};

const updatePost = (manifest, post) => {
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
  });
  return manifest;
};

const removePost = (manifest, name) => {
  // Make sure each post has a path, title, cid, and date
  manifest.posts = manifest.posts.filter((p) => {
    return p.name !== name;
  });
  return manifest;
};

const manifestToFile = async (manifest, path) => {
  // Write the manifest to a file
  return new Promise((resolve, reject) => {
    fs.writeFile(path, JSON.stringify(manifest), (err) => {
      if (err) {
        reject(err);
      }
      resolve();
    });
  });
};

const manifestFromFile = (path) => {
  // Read the manifest from a file
  return new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => {
      if (err) {
        reject(err);
      }
      resolve(JSON.parse(data));
    });
  });
};

module.exports = {
  emptyManifest,
  addPost,
  updatePost,
  removePost,
  manifestToFile,
  manifestFromFile,
};
