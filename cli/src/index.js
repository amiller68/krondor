#!/usr/bin/env node
import { Command } from 'commander';
import readline from 'readline';
import fs from 'fs';
import { toFile } from './entities/toFile.js';
import Manifest, {
  addPost,
  removePost,
  updatePost,
} from './entities/manifest.js';
import History from './entities/history.js';
import Post from './entities/post.js';
import BlogIpfsClient from './ipfs.js';
import BlogEthClient from './eth.js';
import BlogAbi from '../../contracts/artifacts/contracts/Blog.sol/Blog.json' assert { type: 'json' };
import dotenv from 'dotenv';
import _ from 'lodash';

dotenv.config({ path: './.env' });

const program = new Command();
program.description('A commander based CLI for managing blog content');
// Add top level flags
program.option('--prod', 'Whether to use the prod config', false);

const getConfig = async (prod) => {
  let ret;
  if (!prod) {
    console.log('Using dev config');
    ret = await import('../../krondor.dev.json', { assert: { type: 'json' } });
  } else {
    console.log('Using prod config');
    ret = await import('../../krondor.json', { assert: { type: 'json' } });
  }
  return ret.default;
};

const manifestPath = (config) => {
  return config.content_path + config.manifest_filename;
};

const manifestCidPath = (root_cid, config) => {
  return root_cid + '/' + config.manifest_filename;
};

const historyCidPath = (root_cid, config) => {
  return root_cid + '/' + config.history_filename;
};

const historyPath = (config) => {
  return config.content_path + config.history_filename;
};

const postPath = (config, name) => {
  return config.content_path + name;
};

const initSpace = async (config) => {
  console.log('Creating new scratch space for blog content');
  // Create the content directory
  try {
    let manifest = new Manifest(config.eth.contract_address);
    let history = new History();
    await toFile(manifest, manifestPath(config));
    await toFile(history, historyPath(config));
    console.log('Scratch space created');
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const getManifest = async (config) => {
  // Read the manifest file
  let m = await Manifest.fromFile(manifestPath(config));
  return m;
};

const getHistory = async (config) => {
  // Read the history file
  let h = await History.fromFile(historyPath(config));
  return h;
};

program
  .command('init')
  .description('Initialize a new directory for blog content')
  .action(async () => {
    console.log('Initializing manifest to catalog blog content...');
    const config = await getConfig(program.opts().prod);
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
      await fs.promises.rm(manifestPath(config), {
        recursive: true,
      });
    } catch (e) {
      // Do nothing
    } finally {
      await initSpace(config);
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
    const config = await getConfig(program.opts().prod);
    console.log(
      'Adding new post to the local manifest: ' +
        name +
        ' with title: ' +
        title +
        '...'
    );
    const post_path = postPath(config, name);
    try {
      await fs.promises.access(post_path, fs.constants.F_OK);
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
      const manifest = await getManifest(config);
      addPost(manifest, post);
      await toFile(manifest, manifestPath(config));
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
    const config = await getConfig(program.opts().prod);
    const post_path = postPath(config, name);
    console.log('Reading post into IPLD + Manifest');
    const post = await Post.fromFile(post_path);
    try {
      console.log('Updating post in manifest');
      const manifest = await getManifest(config);
      updatePost(manifest, post);
      await toFile(manifest, manifestPath(config));
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
    const config = await getConfig(program.opts().prod);
    const post_path = postPath(config, name);
    try {
      const manifest = await getManifest(config);
      removePost(manifest, name);
      await toFile(manifest, manifestPath(config));
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
      const config = await getConfig(program.opts().prod);
      // Iterate over the posts and publish them to IPFS
      console.log('Publishing posts to IPFS');
      let options = {
        apiKey: process.env.IPFS_API_KEY,
        apiSecret: process.env.IPFS_API_SECRET,
      };
      const ipfs = new BlogIpfsClient(config.ipfs.endpoint, options);
      const hashes = await ipfs.pinDirectory(config.content_path);
      const root_cid = hashes.find((file) => file.Name === '').Hash;

      console.log('Updating history');
      let history = await getHistory(config);
      history.previous_root_cid = root_cid;
      console.log('Root CID: ', root_cid);
      await toFile(history, historyPath(config));

      // Publish the manifest to Eth
      console.log('Publishing Root CID to Eth');
      let eth = new BlogEthClient(
        // config.eth.contract_abi_path,
        BlogAbi.abi,
        config.eth.contract_address,
        `${config.eth.rpc_url}/${process.env.RPC_API_KEY}`,
        config.eth.chain_id,
        process.env.PRIVATE_KEY
      );
      const [gas, gasPrice] = await eth.estimateGasUpdateBlogCid(root_cid);

      console.log(`Estimated gas: ${gas}`);
      console.log(`Estimated gas price: ${gasPrice}`);

      const answer = await askQuestion('Proceed? (y/n)');
      if (answer !== 'y') {
        console.log('Exiting');
        process.exit(0);
      }

      await eth.updateBlogCid(root_cid, gas, gasPrice);
      console.log('Done!');
      process.exit(0);
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  });

program
  .command('sync')
  .description(
    'Pull the latest content from IPFS and Eth to a specified directory'
  )
  .argument('<dir>', 'The directory to sync content to')
  .action(async () => {
    console.log('Syncing content...');
    try {
      const config = await getConfig(program.opts().prod);
      console.log('Contract address: ' + config.eth.contract_address);
      console.log('IPFS endpoint: ' + config.ipfs.endpoint);
      const dir = program.args[1];
      console.log('Syncing content to ' + dir);
      // Get the blog root CID from Eth
      console.log('Getting root CID from Eth');
      let eth = new BlogEthClient(
        // config.eth.contract_abi_path,
        BlogAbi.abi,
        config.eth.contract_address,
        `${config.eth.rpc_url}/${process.env.RPC_API_KEY}`,
        config.eth.chain_id,
        process.env.PRIVATE_KEY
      );
      const root_cid = await eth.getBlogCid();
      console.log('Root CID: ', root_cid);

      // Pull the history and manifest from IPFS
      console.log('Pulling history and manifest from IPFS');

      const manifest_cid_path = manifestCidPath(root_cid, config);
      const history_cid_path = historyCidPath(root_cid, config);
      let options = {
        apiKey: process.env.IPFS_API_KEY,
        apiSecret: process.env.IPFS_API_SECRET,
      };
      const ipfs = new BlogIpfsClient(config.ipfs.endpoint, options);
      await ipfs.pullFile(
        manifest_cid_path,
        dir + '/' + config.manifest_filename
      );
      await ipfs.pullFile(
        history_cid_path,
        dir + '/' + config.history_filename
      );
      console.log('Manifest and history pulled from IPFS');

      console.log('Pulling posts from IPFS');
      // Read the manifest and pull the posts by their names
      const manifest = await Manifest.fromFile(
        dir + '/' + config.manifest_filename
      );
      // _.map(manifest.posts, async (post) => {
      for (const post of manifest.posts) {
        console.log('Pulling post: ' + post.name);
        await ipfs.pullFile(post.cid, dir + '/' + post.name);
      }

      process.exit(0);
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  });

program.parse(process.argv);
