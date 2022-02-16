import Image from 'next/image';
import Link from 'next/link'

export default function ListItem({ item }) {
  const metaData = JSON.parse(item?.metadata);
  
  return (
    <Link href="/collection/[address]/[id]" as={`/collection/${item.token_address}/${item.token_id}`}>
      <div className="relative group hover:cursor-pointer">
        {metaData ? (
          <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75 lg:h-80 lg:aspect-none">
            <Image
              src={metaData?.image}
              alt={metaData?.name}
              className="w-full h-full object-center object-cover lg:w-full lg:h-full"
              width={"280"}
              height={"365"}
            />
          </div>
        ) : null}
        <div className="mt-4 flex items-center justify-between text-base font-medium text-gray-900 space-x-8">
          <h3>
            <a href={item.href}>
              <span aria-hidden="true" className="absolute inset-0" />
              {item.name}
            </a>
          </h3>
          <p>{item.price}</p>
        </div>
        <p className="mt-1 text-sm text-gray-500">{item.category}</p>
      </div>
    </Link>
  )
}