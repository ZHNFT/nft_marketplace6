import { useRouter } from 'next/router';
import Image from 'next/image';
import { resolveBunnyLink } from '../../../Utils';
import { ellipseAddress } from '../../../Utils';
import { Table, RowHeading, Row, Cell } from '../../Table';
import { BeeIcon, DiamondIcon, LinkIcon } from '../../icons';

export default function Items({ results }) {
  const router = useRouter();

  if (!results || !results.length) {
    return <div className="h-[272px] flex justify-center items-center">No items found</div>;
  }

  return (
    <Table className="text-xs dark:text-manatee text-ink">
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
            const { _id:id, tokenId, collectionId, name, imageHosted, lowestPrice, priceUsd, rarityRank } = row;
            return (
              <Row key={id} className="cursor-pointer text-xs !py-2" onClick={() => router.push(`/collections/${collectionId}/token/${tokenId}`)}>
                <Cell className="w-[280px] flex items-center">
                  {imageHosted ? (
                    <Image
                    src={`${resolveBunnyLink(imageHosted)}?optimizer=image&width=24&aspect_ratio=1:1`}
                    alt={name}
                    className="rounded-md"
                    height="24" width="24"
                  /> 
                  ) : (
                    <Image
                      src={NotFoundImage}
                      alt={name}
                      className="rounded-md"
                      height="24" width="24"
                    /> 
                  )}
                  <div className="ml-3">
                    <p className="dark:text-white text-ink">{ name }</p>
                    <span className="dark:text-manatee text-frost text-xxs">{ ellipseAddress(collectionId, 4) }</span>
                  </div>
                </Cell>
                <Cell className="w-[100px] flex flex-col justify-center items-center">
                  <span className="relative -left-[5px] dark:text-white text-malibu truncate  max-w-[100px]">
                    <BeeIcon className="h-[14px] relative -top-[2px] pr-[5px]" />
                    { lowestPrice !== undefined ? lowestPrice : "0" }
                  </span>
                  <p className="dark:text-manatee text-frost text-xxs -mt-[7px]">{ priceUsd }</p>
                </Cell>
                <Cell className="w-[80px] text-center leading-none dark:text-white text-malibu">
                  { rarityRank }
                </Cell>
              </Row>
            );
          })
        }
      </div>
    </Table>
  );
}