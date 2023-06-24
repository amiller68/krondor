#!/usr/bin/env node
import { Command } from 'commander';
import readline from 'readline';
import fs from 'fs';
import Manifest, {
  addPost,
  removePost,
  updatePost,
  toFile,
} from './entities/manifest.js';
import History from './entities/history.js';
import Post from './entities/post.js';
import BlogIpfsClient from './ipfs.js';
import BlogEthClient from './eth.js';
import config from '../../krondor.json' assert { type: 'json' };
import BlogAbi from '../../contracts/artifacts/contracts/Blog.sol/Blog.json' assert { type: 'json' };
import dotenv from 'dotenv';
import _ from 'lodash';

dotenv.config({ path: './..env' });

const content_path = config.cli.content_path;
const manifest_filename = config.cli.manifest_filename;
const history_filename = config.cli.history_filename;

const program = new Command();
program.description('A commander based CLI for managing blog content');

const initSpace = async () => {
  console.log('Creating new scratch space for blog content');
  // Create the content directory
  try {
    let manifest = new Manifest(config.eth.contract_address);
    let history = new History();
    await toFile(manifest, content_path + manifest_filename);
    await toFile(history, content_path + history_filename);
    console.log('Scratch space created');
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const getManifest = async () => {
  // Read the manifest file
  let m = await Manifest.fromFile(content_path + manifest_filename);
  return m;
};

const getHistory = async () => {
  // Read the history file
  let h = await History.fromFile(content_path + history_filename);
  return h;
};

program
  .command('init')
  .description('Initialize a new directory for blog content')
  .action(async () => {
    // Check if the content directory exists in the current directory
    // If it does, prompt the user to confirm that they want to overwrite
    // If it doesn't, create the directory
    console.log('Initializing manifest to catalog blog content...');
    try {
      await fs.promises.access(
        content_path + manifest_filename,
        fs.constants.F_OK
      );
      const answer = await askQuestion(
        'Manifest path already exists. Overwrite? (y/n)'
      );
      if (answer !== 'y') {
        console.log('Exiting');
        process.exit(0);
      }
      await fs.promises.rm(content_path + manifest_filename, {
        recursive: true,
      });
    } catch (e) {
      // Do nothing
    } finally {
      await initSpace();
      process.exit(0);
    }
  });

const askQuestion = (question) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
};

program
  .command('add <name> <title>')
  .description('Add a new blog post to the local manifest...')
  .action(async (name, title) => {
    console.log(
      'Adding new post to the local manifest: ' +
        name +
        ' with title: ' +
        title +
        '...'
    );
    const post_path = content_path + name;
    try {
      await fs.promises.access(name, fs.constants.F_OK);
    } catch (err) {
      console.log('Creating new post');
      const time = new Date();
      await fs.promises.writeFile(
        post_path,
        `# ${title}\n\n${time.toISOString()}`
      );
    }
    console.log('Reading post into IPLD + Manifest');
    const post = await Post.fromFile(post_path, title);
    try {
      console.log('Adding post to manifest');
      const manifest = await getManifest();
      addPost(manifest, post);
      await toFile(manifest, content_path + manifest_filename);
    } catch (err) {
      console.log('Error adding post to manifest: ', err);
      process.exit(1);
    } finally {
      console.log('Done!');
      process.exit(0);
    }
  });

program
  .command('update <name>')
  .description('Update a blog post in the local manifest')
  .action(async (name) => {
    console.log('Updating post in the local manifest: ' + name + '...');
    const post_path = content_path + name;
    console.log('Reading post into IPLD + Manifest');
    const post = await Post.fromFile(post_path);
    try {
      console.log('Updating post in manifest');
      const manifest = await getManifest();
      updatePost(manifest, post);
      await toFile(manifest, content_path + manifest_filename);
      console.log('Added post to manifest. Done!');
      process.exit(0);
    } catch (err) {
      console.log(err);
      console.log('Failed to add post to manifest');
      process.exit(1);
    }
  });

program
  .command('remove <name>')
  .description('Remove a blog post from the local manifest')
  .action(async (name) => {
    console.log('Removing post...');
    const post_path = content_path + name;
    try {
      const manifest = await getManifest();
      removePost(manifest, name);
      await toFile(manifest, content_path + manifest_filename);
      // Remove the post from the filesystem
      await fs.promises.rm(post_path);
      process.exit(0);
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  });

program
  .command('publish')
  .description('Publish the local manifest to Eth and IPFS')
  .action(async () => {
    console.log('Publishing posts to Eth and IPFS...');
    try {
      // Iterate over the posts and publish them to IPFS
      console.log('Publishing posts to IPFS');
      let options = {
        apiKey: process.env.IPFS_API_KEY,
        apiSecret: process.env.IPFS_API_SECRET,
      };
      const ipfs = new BlogIpfsClient(config.ipfs.endpoint, options);
      const hashes = await ipfs.pinDirectory(content_path);
      const root_cid = hashes.find((file) => file.Name === '').Hash;

      console.log('Updating history');
      let history = await getHistory();
      history.previous_root_cid = root_cid;
      console.log('Root CID: ', root_cid);
      await toFile(history, content_path + history_filename);
      // Publish the manifest to Eth
      console.log('Publishing Root CID to Eth');
      let eth = new BlogEthClient(
        // config.eth.contract_abi_path,
        BlogAbi.abi,
        config.eth.contract_address,
        config.eth.rpc_url,
        config.eth.chain_id,
        process.env.PRIVATE_KEY
      );

      await eth.updateBlogCid(root_cid);
      console.log('Done!');
      process.exit(0);
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  });

program.parse(process.argv);
