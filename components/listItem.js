import Image from 'next/image';
import Link from 'next/link'
import { useRouter } from 'next/router'
import { resolveLink } from '../Utils';
import NotFoundImage from "../images/No-Image-Placeholder.png";

export default function ListItem({ item }) {
  const router = useRouter()
  const { tableName, address } = router.query

  return (
    <Link href="/collections/[address]/token/[id]" as={`/collections/${address}/token/${item?.tokenId}`} passHref>
      <div className="relative group hover:cursor-pointer">
        {item?.image ? (
          <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
            <Image
              src={resolveLink(item?.image)}
              alt={item?.tokenId}
              className="w-full h-full object-center object-cover lg:w-full lg:h-full"
              width={"280"}
              height={"365"}
            />
          </div>
        ) : (
          <Image
              src={NotFoundImage}
              alt={item?.tokenId}
              className="w-full h-full object-center object-cover lg:w-full lg:h-full"
              width={"280"}
              height={"365"}
            />
          )}
        <div className="mt-4 flex items-center justify-between text-base font-medium text-gray-900 space-x-8">
          <h3>
            <a href={item?.href}>
              <span aria-hidden="true" className="absolute inset-0" />
              {item?.name ? item?.name : `#${item?.tokenId}`}
            </a>
          </h3>
          <p>{item?.price}</p>
        </div>
        <p className="mt-1 text-sm text-gray-500">{item?.category}</p>
      </div>
    </Link>
  )
}