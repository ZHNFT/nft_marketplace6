import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ellipseAddress } from '../../Utils';
import { LinkIcon } from '../icons';

export default function ProductDetails({ description, address, tokenId, tokenStandard, blockchain, chain}) {

  let blockChainViewerAddress;
  if(chain == "mumbai") {
    blockChainViewerAddress = "https://mumbai.polygonscan.com/address/" + address
  }
  else if (chain == "polygon") {
    blockChainViewerAddress = "https://polygonscan.com/address/" + address
  } else {

    blockChainViewerAddress = "/"

  }

  return (
    <div className="text-xs">
      {
        description && (
          <>
            <h3 className="text-manatee">Description</h3>
            <div className="mb-7 font-medium">
              <ReactMarkdown
                className='mt-6 whitespace-pre-line'
                remarkPlugins={[remarkGfm]}
                components={{
                  a: ({node, ...props}) => <a {...props} className="text-cornflower hover:underline" />,
                  p: ({node, ...props}) => <p {...props} />
                }}
              >
                {description}
              </ReactMarkdown>
            </div>
          </>
        )
      }
      <div className="flex justify-between my-2">
        <span className="text-manatee">Contract address</span>
        <span className="font-medium">
          
          <a target="_blank" href={blockChainViewerAddress} rel="noreferrer" className="hover:underline flex">
            { ellipseAddress(address, 4) }
            <LinkIcon className="w-[12px] ml-2" />
          </a>
        </span>
      </div>

      <div className="flex justify-between my-2">
        <span className="text-manatee">Token ID</span>
        <span className="font-medium">{ tokenId }</span>
      </div>

      <div className="flex justify-between my-2">
        <span className="text-manatee">Token Standard</span>
        <span className="font-medium">{ tokenStandard }</span>
      </div>

      { 
        blockchain && (
          <div className="flex justify-between my-2">
            <span className="text-manatee">Blockchain</span>
            <span className="font-medium">{ blockchain }</span>
          </div>
        )
      }
    </div>
  );
};