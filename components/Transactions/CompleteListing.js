import Image from 'next/image';
import { TRANSACTION_STATUS } from '../../constants/nft';
import { ellipseAddress } from '../../Utils';
import ItemPrice from '../ItemPrice/ItemPrice';
import PrimaryButton from '../Buttons/PrimaryButton';
import TransactionList from './TransactionList';

export default function CompleteListing(props) {
  const { type, name, imageUrl, collection, price, currency, onCancel } = props;
  return (
    <div className="max-w-lg mt-5">
        <div className="flex justify-between mb-6">
          <div className="flex items-center">
            { 
              imageUrl && (
                <div className="mr-2 rounded-xl overflow-hidden h-[40px]">
                  <Image src={imageUrl} alt={name} width={40} height={40} />
                </div>
              )
            }
            <div className="leading-none">
              <p className="text-sm text-manatee">{ ellipseAddress(collection, 4) }</p>
              <p>{ name }</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-manatee">Price</p>
            <ItemPrice value={price} />
          </div>
        </div>
        <div className="my-6">
          <TransactionList
            steps={[
              {
                title: 'Approval to transfer',
                status: TRANSACTION_STATUS.IN_PROGRESS,
                isDefaultOpen: true,
                description: 'To get set up for auction listings for the first time, you must approve this item for sale, which requires a one-time gas fee.'
              },
              {
                className: 'my-2',
                title: `${type === 'auction' ? 'Transfering NFT' : 'Requesting Signature'}`,
                status: TRANSACTION_STATUS.INACTIVE,
                isDefaultOpen: false,
                description: 'Description here'
              },
              {
                className: 'my-2',
                title: 'Listing of Auction has Completed',
                status: TRANSACTION_STATUS.INACTIVE,
                isDefaultOpen: false,
                description: 'Description here'
              }
            ]}
          />

        <div className="mt-9 flex justify-center">
          <PrimaryButton
            className="max-w-[300px]"
            onClick={onCancel}
          >
            Cancel listing
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}