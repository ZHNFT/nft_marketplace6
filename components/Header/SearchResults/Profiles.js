import { useRouter } from 'next/router';
import Image from 'next/image';
import { resolveBunnyLink } from '../../../Utils';
import { formatEther } from '../../../Utils/helper';
import { Table, RowHeading, Row, Cell } from '../../Table';
import { BeeIcon } from '../../icons';
import DefaultLogo from '../../../images/default-collection-logo.png';

export default function Profiles({ results }) {
  const router = useRouter();

  if (!results || !results.length) {
    return <div className="h-[272px] flex justify-center items-center">No users found</div>;
  }

  return (
    <Table className="text-xs">
      <RowHeading>
        <Cell className="w-[230px]"></Cell>
        <Cell className="w-[100px] text-center">Transactions</Cell>
        <Cell className="w-[80px] text-center">Volume</Cell>
      </RowHeading>
      <div className="h-[240px] overflow-y-auto scroller">
        {
          results?.map((row, index) => {
            const { _id:id, address, username, images, sales, volume } = row;
            return (
              <Row key={id} className="cursor-pointer text-xs !py-2" onClick={() => router.push(`/users/${address}`)}>
                <Cell className="w-[230px] flex items-center">
                  <Image className="rounded-full" src={resolveBunnyLink(images?.profile) || DefaultLogo} alt={username} height="24" width="24" />
                  <span className="text-white ml-3">{ username }</span>
                </Cell>
                <Cell className="w-[100px] flex flex-col justify-center items-center">
                  <span className="relative -left-[5px] text-white">
                    <BeeIcon className="h-[14px] relative -top-[2px] pr-[5px]" />
                    { sales?.total }
                  </span>
                </Cell>
                <Cell className="w-[80px] text-center leading-none text-white">
                  { volume?.total ? formatEther(volume?.total) : '0' }
                </Cell>
              </Row>
            );
          })
        }
      </div>
    </Table>
  );
}