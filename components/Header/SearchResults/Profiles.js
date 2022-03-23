import { useRouter } from 'next/router';
import Image from 'next/image';
import { Table, RowHeading, Row, Cell } from '../../Table';
import { BeeIcon, DiamondIcon, LinkIcon } from '../../icons';

const results = [
  { id: 1, address: '#', name: 'Bob Geldof', imageUrl: '/test/gallery/1.png', value: 38, itemCount: 14 },
  { id: 2, address: '#', name: 'Bob Geldof', imageUrl: '/test/gallery/1.png', value: 38, itemCount: 14 },
  { id: 3, address: '#', name: 'Bob Geldof', imageUrl: '/test/gallery/1.png', value: 38, itemCount: 14 },
  { id: 4, address: '#', name: 'Bob Geldof', imageUrl: '/test/gallery/1.png', value: 38, itemCount: 14 },
  { id: 5, address: '#', name: 'Bob Geldof', imageUrl: '/test/gallery/1.png', value: 38, itemCount: 14 },
  { id: 6, address: '#', name: 'Bob Geldof', imageUrl: '/test/gallery/1.png', value: 38, itemCount: 14 },
  { id: 7, address: '#', name: 'Bob Geldof', imageUrl: '/test/gallery/1.png', value: 38, itemCount: 14 },
  { id: 8, address: '#', name: 'Bob Geldof', imageUrl: '/test/gallery/1.png', value: 38, itemCount: 14 },
  { id: 9, address: '#', name: 'Bob Geldof', imageUrl: '/test/gallery/1.png', value: 38, itemCount: 14 },
  { id: 10, address: '#', name: 'Bob Geldof', imageUrl: '/test/gallery/1.png', value: 38, itemCount: 14 }
];

export default function Collections() {
  const router = useRouter();
  return (
    <Table className="text-xs">
      <RowHeading>
        <Cell className="w-[280px]"></Cell>
        <Cell className="w-[100px] text-center">Value</Cell>
        <Cell className="w-[80px] text-center">Items</Cell>
      </RowHeading>
      <div className="h-[240px] overflow-y-scroll scroller">
        {
          results?.map((row, index) => {
            const { id, address, name, imageUrl, value, itemCount } = row;
            return (
              <Row key={id} className="cursor-pointer text-xs !py-2" onClick={() => router.push('#')}>
                <Cell className="w-[280px] flex items-center">
                  <Image className="rounded-full" src={imageUrl} alt={name} height="24" width="24" />
                  <span className="text-white ml-3">{ name }</span>
                </Cell>
                <Cell className="w-[100px] flex flex-col justify-center items-center">
                  <span className="relative -left-[5px] text-white">
                    <BeeIcon className="w-[26px] relative -top-[2px]" />
                    { value }
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