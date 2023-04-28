const Web3 = require('web3');
const Blog = require('../../contracts/artifacts/constracts/blog.sol/Blog.json');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../env/chain.env') });
dotenv.config({ path: path.resolve(__dirname, '../../env/contract.env') });

// Create a new Web3 instance
const web3 = new Web3(process.env.RPC_URL);

// Get the contract instance
const contract = new web3.eth.Contract(Blog.abi, process.env.BLOG_CONTRACT_ADDRESS);

const updateCID = async (cid) => {
    // Update the CID (requires the contract owner's private key)
    const privateKey = process.env.PRIVATE_KEY;
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    web3.eth.accounts.wallet.add(account);
    contract.methods.updateCID(cid).send({ from: account.address })
        .on('transactionHash', (hash) => {
            console.log('Transaction hash:', hash);
        })
        .on('receipt', (receipt) => {
            console.log('Transaction receipt:', receipt);
        })
        .on('error', (error) => {
            console.error('Transaction error:', error);
        });
}