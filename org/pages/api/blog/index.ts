// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

import Web3 from 'web3'
// const Web3 = require('web3');
import  Blog from '../../../Blog.json';
// const dotenv = require('dotenv');

interface Data {
    cid: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // Try to connect to the RPC URL
    const rpcUrl = process.env.NEXT_PRIVATE_RPC_URL || '';
    const web3 = new Web3(rpcUrl);
    const contractAddress = process.env.NEXT_PUBLIC_BLOG_CONTRACT_ADDRESS || '';
    const contract = new web3.eth.Contract(Blog.abi as any, contractAddress);
    const cid = await contract.methods.getCID().call();
    res.status(200).json({ cid });
}
