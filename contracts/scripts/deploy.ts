// @ts-ignore
import { ethers } from 'hardhat';
import fs from 'fs';

/* Blog Deployment script */
async function main() {
  const gas = await ethers.provider.getGasPrice();
  const Blog = await ethers.getContractFactory('Blog');
  const blogData = Blog.getDeployTransaction().data;
  const estimateGas = await ethers.provider.estimateGas({ data: blogData });

  console.log(
    'Deploying blog contract to network:',
    ethers.provider.network.name
  );

  console.log('Gas estimate: ', estimateGas.toString());
  console.log('Gas price: ', gas.toString());

  console.log('Would you like to deploy? (y/n)');
  const stdin = process.openStdin();
  stdin.addListener('data', async (d) => {
    const input = d.toString().trim();
    if (input !== 'y') {
      console.log('Exiting...');
      process.exit(0);
    }
    const blog = await Blog.deploy({
      gasLimit: estimateGas,
      gasPrice: gas,
    });
    await blog.deployed();
    console.log('Blog deployed to:', blog.address);
    console.log(
      'Gas used:',
      (await blog.deployTransaction.wait()).gasUsed.toString()
    );
    console.log('Saving contract address to file...');
    // TODO: Fix this hacky way of saving the contract address
    let config_path = './../../krondor.json';
    let save_path = './../krondor.json';
    if (process.env.NODE_ENV === 'development') {
      config_path = './../../krondor.dev.json';
      save_path = './../krondor.dev.json';
    }
    let config = require(config_path);
    config.eth.contract_address = blog.address;
    fs.writeFileSync(save_path, JSON.stringify(config, null, 2));
    console.log('Done!');
    process.exit(0);
  });
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
