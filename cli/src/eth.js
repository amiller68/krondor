import Web3 from 'web3';

/*
 * A class for interacting with the Ethereum blockchain.
 */
//@ ts-ignore
export default class BlogEthClient {
  contract;
  web3;
  chain_id;
  signer;
  /*
   * @param abi_path - The path to the ABI file for the contract.
   * @param contract_address - The address of the contract.
   * @param rpc_url - The URL of the RPC server.
   * @param private_key - The private key of the contract owner.
   */
  constructor(abi, contract_address, rpc_url, chain_id, private_key) {
    this.web3 = new Web3(new Web3.providers.HttpProvider(rpc_url));
    this.contract = new this.web3.eth.Contract(abi, contract_address);
    const account = private_key
      ? this.web3.eth.accounts.privateKeyToAccount('0x' + private_key)
      : null;
    if (account) {
      this.web3.eth.accounts.wallet.add(account);
      this.signer = account;
    }
    this.chain_id = chain_id;
  }

  async updateBlogCid(cid) {
    // Check the contract owner
    const owner = await this.contract.methods.owner().call();
    if (owner !== this.signer.address) {
      throw new Error('Only the contract owner can update the CID');
    }

    const tx = this.contract.methods.updateCID(cid);
    const network = this.chain_id === 1 ? 'mainnet' : 'sepolia';

    const transactionParameters = {
      from: this.signer.address,
      to: this.contract.options.address, // contract address
      data: tx.encodeABI(), // Encoded contract function call
      gas: '5000000',
      gasPrice: await this.web3.eth.getGasPrice(),
      chainId: this.chain_id,
    };

    // Sign the transaction
    const signedTx = await this.web3.eth.accounts.signTransaction(
      transactionParameters,
      this.signer.privateKey
    );

    console.log(`Sending transaction ...`);
    await this.web3.eth
      .sendSignedTransaction(signedTx.rawTransaction)
      .once('transactionHash', (txhash) => {
        console.log(`Mining transaction ...`);
        console.log(`https://${network}.etherscan.io/tx/${txhash}`);
      })
      .on('receipt', (receipt) => {
        console.log(`Mined in block ${receipt.blockNumber}`);
      })
      .on('error', console.error);
  }

  async getBlogCid() {
    return await this.contract.methods.getCID().call();
  }
}
