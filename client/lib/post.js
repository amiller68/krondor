const CID = require('cids');
const multihashing = require('multihashing-async');
const fs = require('fs').promises;
const timestamp = require('unix-timestamp');

const emptyPost = {
  name: '',
  cid: '',
  title: '',
  date: '',
};

const fromFile = async (path) => {
  console.log('fromFile', path);
  const file = await fs.readFile(path);
  const hash = await multihashing(file, 'sha2-256');
  const cid = new CID(1, 'dag-pb', hash).toString();

  // Get the name from the path
  const name = path.split('/').pop();
  const date = timestamp.toDate(timestamp.now());

  return {
    name,
    cid,
    title: '',
    date,
  };
};

const withTitle = (post, title) => {
  return {
    ...post,
    title,
  };
};

module.exports = { emptyPost, fromFile, withTitle };
