import { useRouter } from 'next/router';
import Image from 'next/image';
import { Table, RowHeading, Row, Cell } from '../../Table';
import { BeeIcon, DiamondIcon, LinkIcon } from '../../icons';

const results = [
  { id: 1, address: '#', collection: 'Bee Collection', name: 'Bee #622', imageUrl: '/test/gallery/1.png', price: 38, priceUsd: 5852.22, rarity: 23 },
  { id: 2, address: '#', collection: 'Bee Collection', name: 'Bee #622', imageUrl: '/test/gallery/1.png', price: 38, priceUsd: 5852.22, rarity: 23 },
  { id: 3, address: '#', collection: 'Bee Collection', name: 'Bee #622', imageUrl: '/test/gallery/1.png', price: 38, priceUsd: 5852.22, rarity: 23 },
  { id: 4, address: '#', collection: 'Bee Collection', name: 'Bee #622', imageUrl: '/test/gallery/1.png', price: 38, priceUsd: 5852.22, rarity: 23 },
  { id: 5, address: '#', collection: 'Bee Collection', name: 'Bee #622', imageUrl: '/test/gallery/1.png', price: 38, priceUsd: 5852.22, rarity: 23 },
  { id: 6, address: '#', collection: 'Bee Collection', name: 'Bee #622', imageUrl: '/test/gallery/1.png', price: 38, priceUsd: 5852.22, rarity: 23 },
  { id: 7, address: '#', collection: 'Bee Collection', name: 'Bee #622', imageUrl: '/test/gallery/1.png', price: 38, priceUsd: 5852.22, rarity: 23 },
  { id: 8, address: '#', collection: 'Bee Collection', name: 'Bee #622', imageUrl: '/test/gallery/1.png', price: 38, priceUsd: 5852.22, rarity: 23 },
  { id: 9, address: '#', collection: 'Bee Collection', name: 'Bee #622', imageUrl: '/test/gallery/1.png', price: 38, priceUsd: 5852.22, rarity: 23 },
  { id: 10, address: '#', collection: 'Bee Collection', name: 'Bee #622', imageUrl: '/test/gallery/1.png', price: 38, priceUsd: 5852.22, rarity: 23 },
  { id: 11, address: '#', collection: 'Bee Collection', name: 'Bee #622', imageUrl: '/test/gallery/1.png', price: 38, priceUsd: 5852.22, rarity: 23 },
  { id: 12, address: '#', collection: 'Bee Collection', name: 'Bee #622', imageUrl: '/test/gallery/1.png', price: 38, priceUsd: 5852.22, rarity: 23 },
  { id: 13, address: '#', collection: 'Bee Collection', name: 'Bee #622', imageUrl: '/test/gallery/1.png', price: 38, priceUsd: 5852.22, rarity: 23 }
];

export default function Collections() {
  const router = useRouter();
  return (
    <Table className="text-xs">
      <RowHeading>
        <Cell className="w-[280px]"></Cell>
        <Cell className="w-[100px] text-center">Price</Cell>
        <Cell className="w-[80px] text-center">
          <span className="sr-only">Rarity</span>
          <DiamondIcon className="w-[12px] -mt-[3px]" />
        </Cell>
      </RowHeading>
      <div className="h-[240px] overflow-y-scroll scroller">
        {
          results?.map((row, index) => {
            const { id, address, collection, name, imageUrl, price, priceUsd, rarity } = row;
            return (
              <Row key={id} className="cursor-pointer text-xs !py-2" onClick={() => router.push('#')}>
                <Cell className="w-[280px] flex items-center">
                  <Image className="rounded-md" src={imageUrl} alt={name} height="24" width="24" />
                  <div className="ml-3">
                    <p className="text-white">{ name }</p>
                    <span className="text-manatee text-xxs">{ collection }</span>
                  </div>
                </Cell>
                <Cell className="w-[100px] flex flex-col justify-center items-center">
                  <span className="relative -left-[5px] text-white">
                    <BeeIcon className="h-[16px] relative -top-[2px]" />
                    { price }
                  </span>
                  <p className="text-manatee text-xxs -mt-[7px]">{ priceUsd }</p>
                </Cell>
                <Cell className="w-[80px] text-center leading-none text-white">
                  { rarity }
                </Cell>
              </Row>
            );
          })
        }
      </div>
    </Table>
  );
}