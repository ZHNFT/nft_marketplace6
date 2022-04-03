import Image from 'next/image';
import Link from 'next/link'
import { useRouter } from 'next/router'
import { resolveLink, resolveBunnyLink } from '../Utils';
import NotFoundImage from "../images/No-Image-Placeholder.png";

export default function ListItem({ item }) {
  const router = useRouter()
  const { address } = router.query

  return (
    <Link href="/collections/[address]/token/[id]" as={`/collections/${address}/token/${item?.tokenId}`} passHref>
      <div className="relative group cursor-pointer">
        {item?.image ? (
          <div className="block w-full min-h-80 bg-gray-200 aspect-w-1 lg:aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
             {/* https://nextjs.org/docs/api-reference/next/image */}
            <Image
              src={resolveBunnyLink(item?.image)}
              alt={item?.tokenId}
              className="w-full h-full object-center object-cover lg:w-full lg:h-full"
              // layout="fill"
              layout="responsive"
              width={"280"}
              height={"365"}
              // https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit
              objectFit=""
              // https://developer.mozilla.org/en-US/docs/Web/CSS/object-position
              objectPosition=""
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