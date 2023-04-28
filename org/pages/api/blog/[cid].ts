// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = {
  content: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // Copilot prompt: Try fetching the CID in the request from a list of known IPFS gateways
  // Return the content of the blog post fetched if successful within a Data object
  // Otherwise return an error message based on the error code within a Markdown string
  // Use the following error codes
  // 0 - No error
  // 1 - Invalid CID
  // 2 - Unable to fetch from gateway
  // 3 - Invalid gateway
  // 4 - Invalid response
  const { cid } = req.query;
  const gateways = [
    'https://ipfs.io',
    'https://cloudflare-ipfs.com',
    'https://ipfs.infura.io',
    'https://ipfs.dweb.link',
  ];
  let gateway = gateways[0];
  let md = '';
  let error = 0;
  for (let i = 0; i < gateways.length; i++) {
    try {
      md = await fetch(gateways[i] + '/ipfs/' + cid).then((r) => r.text());
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
    res.status(200).json({ content: md });
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
    res.status(404).json({ content: '', error: errorMsg });
  }
}
