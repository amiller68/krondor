// Note: Be careful you don't fuck with any of these imports
import BlogEthClient from '../../cli/src/eth.js';
import config from '../../krondor.json';
import BlogAbi from '../../contracts/artifacts/contracts/Blog.sol/Blog.json';
import dotenv from 'dotenv';
dotenv.config({ path: '../../.env' });

export default class Config {
  config: any;
  ethereum: any;
  constructor() {
    if (process.env.NODE_ENV === 'development') {
      console.debug('Initializing development environment...');
      this.config = require('../../krondor.dev.json');
    } else {
      this.config = require('../../krondor.json');
    }
    this.ethereum = new BlogEthClient(
      BlogAbi.abi,
      this.config.eth.contract_address,
      `${this.config.eth.rpc_url}/${process.env.RPC_API_KEY}`,
      this.config.eth.chain_id
    );
  }

  public getBlogCid = async () => {
    return await this.ethereum.getBlogCid();
  };

  public getCidFromGateways = async (
    cid: string,
    format: 'text' | 'json' = 'text'
  ) => {
    let gateways = this.config.ipfs.gateways;
    let gateway = gateways[0];
    let content = '';
    let error = 0;
    for (let i = 0; i < gateways.length; i++) {
      try {
        content = await fetch(gateways[i] + '/ipfs/' + cid, {
          mode: 'cors',
        }).then((res) => {
          if (format === 'text') {
            return res.text();
          } else {
            return res.json();
          }
        });
        gateway = gateways[i];
        break;
      } catch (e: any) {
        if (e.message.includes('404')) {
          error = 3;
        } else if (e.message.includes('400')) {
          error = 1;
        } else {
          error = 2;
        }
      }
    }
    if (error === 0) {
      return { content };
    } else {
      let errorMsg;
      switch (error) {
        case 1:
          errorMsg = `Invalid CID: ${cid}`;
          break;
        case 2:
          errorMsg = `Unable to fetch from gateway: ${gateway}`;
          break;
        case 3:
          errorMsg = `Invalid gateway: ${gateway}`;
          break;
        default:
          errorMsg = 'Invalid response';
          break;
      }
      return { content: {}, error: errorMsg };
    }
  };
}
