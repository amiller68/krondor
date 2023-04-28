import { time, loadFixture } from '@nomicfoundation/hardhat-network-helpers';
const { anyValue } = require('@nomicfoundation/hardhat-chai-matchers/withArgs');
import { expect } from 'chai';
// @ts-ignore
import { ethers } from 'hardhat';

/* Blog Contract Test Suite */

describe('Blog', function () {
  async function fixture() {
    // Get the contract factory and signer
    const Blog = await ethers.getContractFactory('Blog');
    const [owner, otherAccount] = await ethers.getSigners();

    // Deploy the contract
    const blog = await Blog.deploy();
    await blog.deployed();
    return { blog, owner, otherAccount };
  }

  it('should deploy the contract', async function () {
    const { blog } = await loadFixture(fixture);
    expect(blog.address).to.not.equal(anyValue());
  });

  it('should allow the owner to update the CID', async function () {
    const { blog, owner } = await loadFixture(fixture);
    const cid = 'QmYXlkdu0md0d2';
    // @ts-ignore - chai-matchers doesn't get picked up, but this should work
    await expect(blog.updateCID(cid)).to.emit(blog, 'updatedCID').withArgs(cid);
    expect(await blog.getCID()).to.equal(cid);
  });

  it('should not allow a non-owner to update the CID', async function () {
    const { blog, otherAccount } = await loadFixture(fixture);
    const cid = 'QmYXlkdu0md0d2';
    // @ts-ignore - chai-matchers doesn't get picked up, but this should work
    await expect(blog.connect(otherAccount).updateCID(cid)).to.be.revertedWith(
      'Ownable: caller is not the owner'
    );
  });
});
