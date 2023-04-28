const program = require('commander');
const readline = require('readline');
const fs = require('fs');
const { version } = require('../package.json');
const {
  emptyManifest,
  manifestToFile,
  addPost,
  updatePost,
  removePost,
  manifestFromFile,
} = require('../lib/manifest');
const { fromFile, withTitle } = require('../lib/post');
const { pinFile } = require('../lib/ipfs');

const content_path = './content';
const manifest_path = content_path + '/manifest.json';
const posts_path = content_path + '/posts';

program
  .version(version)
  .description('A commander based CLI for managing blog content');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const scratchSpace = async () => {
  console.log('Creating new scratch space for blog content');
  // Create the content directory
  try {
    await fs.promises.mkdir(content_path, { recursive: true });
    await fs.promises.mkdir(content_path + '/posts', { recursive: true });
    const manifest = emptyManifest(version);
    await manifestToFile(manifest, manifest_path);
    console.log('Scratch space created');
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const checkFileExists = (path) => {
  try {
    fs.accessSync(path, fs.constants.F_OK);
  } catch (err) {
    console.log(`File ${path} does not exist. Run \`init\` to create a new one`);
    process.exit(1);
  }
};

const checkPaths = () => {
  checkFileExists(content_path);
  checkFileExists(manifest_path);
};

const getManifest = () => {
  // Check paths
  checkPaths();
  // Read the manifest file
  return manifestFromFile(manifest_path);
};

program
  .command('init')
  .description('Initialize a new directory for blog content')
  .action(async () => {
    // Check if the content directory exists in the current directory
    // If it does, prompt the user to confirm that they want to overwrite
    // If it doesn't, create the directory
    console.log('Initializing scratch space to work on blog content');
    try {
      await fs.promises.access(content_path, fs.constants.F_OK);
      const answer = await askQuestion(
        'Content directory already exists. Overwrite? (y/n)'
      );
      if (answer !== 'y') {
        console.log('Exiting');
        process.exit(0);
      }
      await fs.promises.rm(content_path, { recursive: true });
    } catch (err) {
      // Directory doesn't exist, so we can just create it
    }
    await scratchSpace();
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
  .description('Add a new blog post to the local manifest')
  .action(async (name, title) => {
    console.log('Adding new post to the local manifest: ' + name);
    const path = posts_path + '/' + name + '.md';
    try {
      await fs.promises.access(path, fs.constants.F_OK);
    } catch (err) {
      console.log("Creating new post...")
      const time = new Date();
      await fs.promises.writeFile(path, `# ${title}\n\n${time.toISOString()}`);
    }
    console.log("Reading post into IPLD + Manifest...")
    const manifest = await getManifest(manifest_path);
    const post = await fromFile(path);
    try {
      addPost(manifest, withTitle(post, title))
    } catch (err) {
      console.log("Error adding post to manifest: ", err);
      process.exit(1);
    }
    console.log("Adding post to IPFS...")
    const res = await pinFile(path);
    if (res.hash !== post.hash) {
      console.log('Hashes do not match');
      process.exit(1);
    }
    console.log("Adding post to manifest...")
    try {
      await manifestToFile(manifest, manifest_path);
      console.log('Added post to manifest. Done!');
      process.exit(0);
    } catch (err) {
      console.log(err);
      console.log('Failed to add post to manifest');
      process.exit(1);
    }
  });

program
  .command('update <name>')
  .description('Update a blog post in the local manifest')
  .action(async (name) => {
    console.log('Updating post in the local manifest');

    const path = posts_path + '/' + name + '.md';
    console.log("Reading post into IPLD + Manifest...")
    const manifest = await getManifest(manifest_path);
    const post = await getPost(name); 
    try {
      updatePost(manifest, post)
    } catch (err) {
      console.log("Error adding post to manifest: ", err);
      process.exit(1);
    }
    console.log("Adding post to IPFS...")
    const res = await pinFile(path);
    if (res.hash !== post.hash) {
      console.log('Hashes do not match');
      process.exit(1);
    }
    console.log("Adding post to manifest...")
    try {
      await manifestToFile(manifest, manifest_path);
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
    console.log('Removing post from the local manifest');
    try {
      const manifest = await getManifest(manifest_path);
      const post = await getPost(name);
      removePost(manifest, post.name);
      await manifestToFile(manifest, manifest_path);
      process.exit(0);
    } catch (err) {
      console.log(err);
      process.exit(1);
    }
  });

async function getPost(name) {
  const path = posts_path + '/' + name + '.md';
  try {
    await fs.promises.access(path, fs.constants.F_OK);
    return fromFile(path);
  } catch (err) {
    console.log('Post does not exist. Exiting');
    process.exit(1);
  }
}

program
  .command('publish')
  .description('Publish the local manifest to Eth and IPFS')
  .action(async () => {
    console.log('Publishing manifest to Eth and IPFS');

  });

program.parse(process.argv);
