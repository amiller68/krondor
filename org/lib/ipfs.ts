
import config from '../../krondor.json';

export default async function getCidFromGateways(
    cid: string,
    format: 'text' | 'json' = 'text'
  ) {
    let gateways = config.ipfs.gateways;
    let gateway = gateways[0];
    let content = '';
    let error = 0;
    for (let i = 0; i < gateways.length; i++) {
      try {
        content = await fetch(gateways[i] + '/ipfs/' + cid).then((res) => {
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
  }