// @ts-ignore
import { ethers } from 'hardhat';

/* Blog Deployment script */
async function main() {
  const gas = await ethers.provider.getGasPrice();
  const Blog = await ethers.getContractFactory('Blog');
  console.log('Deploying blog contract...');
  const blog = await Blog.deploy({ gasLimit: 2000000, gasPrice: gas.mul(20) });
  await blog.deployed();
  console.log('Blog deployed to:', blog.address);
  console.log('Gas price:', gas.toString());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
