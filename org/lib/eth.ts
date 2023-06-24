// Note: Be careful you don't fuck with any of these imports
import BlogEthClient from '../../cli/src/eth.js';
import config from '../../krondor.json';
import BlogAbi from '../../contracts/artifacts/contracts/Blog.sol/Blog.json';

const getBlogCid = async () => {
  const client = new BlogEthClient(
    BlogAbi.abi,
    config.eth.contract_address,
    config.eth.rpc_url,
    config.eth.chain_id
  );
  return await client.getBlogCid();
}
export default getBlogCid;