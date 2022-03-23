import { useRouter } from 'next/router';
import Image from 'next/image';
import { Table, RowHeading, Row, Cell } from '../../Table';
import { BeeIcon, LinkIcon } from '../../icons';

const results = [
  { id: 1, address: '#', collection: 'Hive Investments', name: 'Bee Collection', imageUrl: '/test/gallery/1.png', floor: 38, itemCount: 480 },
  { id: 2, address: '#', collection: 'Hive Investments', name: 'Bee Collection', imageUrl: '/test/gallery/1.png', floor: 38, itemCount: 480 },
  { id: 3, address: '#', collection: 'Hive Investments', name: 'Bee Collection', imageUrl: '/test/gallery/1.png', floor: 38, itemCount: 480 },
  { id: 4, address: '#', collection: 'Hive Investments', name: 'Bee Collection', imageUrl: '/test/gallery/1.png', floor: 38, itemCount: 480 },
  { id: 5, address: '#', collection: 'Hive Investments', name: 'Bee Collection', imageUrl: '/test/gallery/1.png', floor: 38, itemCount: 480 },
  { id: 6, address: '#', collection: 'Hive Investments', name: 'Bee Collection', imageUrl: '/test/gallery/1.png', floor: 38, itemCount: 480 },
  { id: 7, address: '#', collection: 'Hive Investments', name: 'Bee Collection', imageUrl: '/test/gallery/1.png', floor: 38, itemCount: 480 },
  { id: 8, address: '#', collection: 'Hive Investments', name: 'Bee Collection', imageUrl: '/test/gallery/1.png', floor: 38, itemCount: 480 },
  { id: 9, address: '#', collection: 'Hive Investments', name: 'Bee Collection', imageUrl: '/test/gallery/1.png', floor: 38, itemCount: 480 },
  { id: 10, address: '#', collection: 'Hive Investments', name: 'Bee Collection', imageUrl: '/test/gallery/1.png', floor: 38, itemCount: 480 }
];

export default function Collections() {
  const router = useRouter();
  return (
    <Table className="text-xs">
      <RowHeading>
        <Cell className="w-[280px]"></Cell>
        <Cell className="w-[100px] text-center">Floor</Cell>
        <Cell className="w-[80px] text-center">Items</Cell>
      </RowHeading>
      <div className="h-[240px] overflow-y-scroll scroller">
        {
          results?.map((row, index) => {
            const { id, address, collection, name, imageUrl, floor, itemCount } = row;
            return (
              <Row key={id} className="cursor-pointer text-xs !py-2" onClick={() => router.push('#')}>
                <Cell className="w-[280px] flex items-center">
                  <Image className="rounded-xl" src={imageUrl} alt={name} height="24" width="24" />
                  <div className="ml-3">
                    <span className="text-manatee text-xxs">{ collection }</span>
                    <p className="text-white">{ name }</p>
                  </div>
                </Cell>
                <Cell className="w-[100px] flex flex-col justify-center items-center">
                  <span className="relative -left-[5px] text-white">
                    <BeeIcon className="w-[26px] relative -top-[2px]" />
                    { floor }
                  </span>
                </Cell>
                <Cell className="w-[80px] text-center leading-none text-white">
                  { itemCount }
                </Cell>
              </Row>
            );
          })
        }
      </div>
    </Table>
  );
}