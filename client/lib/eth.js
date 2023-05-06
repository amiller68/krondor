const Web3 = require('web3');
const Blog = require('../../contracts/artifacts/contracts/blog.sol/Blog.json');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../env/chain.env') });
dotenv.config({ path: path.resolve(__dirname, '../../env/contract.env') });

// Create a new Web3 instance
const web3 = new Web3(process.env.RPC_URL);

// Get the contract instance
const contract = new web3.eth.Contract(Blog.abi, process.env.BLOG_CONTRACT_ADDRESS);

const updateBlogCid = async (cid) => {
    // Add the 0x prefix to the CID
  const cidWithPrefix = web3.utils.asciiToHex(cid);
  // Convert the CID to a buffer
  const cidBuffer = Buffer.from(cidWithPrefix, 'hex');
  //pdate the CID (requires the contract owner's private key)
    const privateKey = process.env.PRIVATE_KEY;
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    web3.eth.accounts.wallet.add(account);
    // Set the chain ID (for MetaMask)
    // web3.eth.defaultChain = 'goerli';
    // // Set the default account (for MetaMask)
    // web3.eth.defaultHardfork = 'istanbul';
    console.log('Account:', account.address);
    console.log('CID:', cid);
    console.log('CID with prefix:', cidWithPrefix);
    console.log("Updating CID...")
    const r = await contract.methods.updateCID(cid).send({ 
        from: account.address,
        gas: 1000000,
        gasPrice: 1000000000,
        chainId: Number(process.env.CHAIN_ID)
     })
     console.log("CID updated!")
    return r
}

module.exports = { updateBlogCid };