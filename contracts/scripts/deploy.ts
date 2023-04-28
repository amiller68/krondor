// @ts-ignore
import { ethers } from 'hardhat';

/* Blog Deployment script */
async function main() {
  // Get the contract factory and signer
  const gas = await ethers.provider.getGasPrice();
  const Blog = await ethers.getContractFactory('Blog');
  // Deploy the contract
  console.log('Deploying blog contract...');
  const blog = await Blog.deploy();
  await blog.deployed();
  console.log('Blog deployed to:', blog.address);
  console.log('Gas price:', gas.toString());

  // Echo the contract address to ../../env/contract.env
  const fs = require('fs');
  const path = require('path');
  const envPath = path.join(__dirname, '../../env/contract.env');
  fs.writeFileSync(envPath, `BLOG_CONTRACT_ADDRESS=${blog.address}`);
  console.log(`Contract address written to ${envPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
