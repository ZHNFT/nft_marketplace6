
export default function ProductDetailsHeader() {
  const dateFormat = `EEEE do LLLL 'at' k:m`;

  return (
    <div className="flex flex-col">
      <h1 className="text-2xl tracking-tight sm:text-3xl">{data?.name}</h1>

      <h2 id="information-heading" className="sr-only">
        NFT information
      </h2>
      <p className="text-sm text-[#969EAB] mt-2">
        {/* Could also link to profile/account within the market place instead of blockexplorer */}
        Owned by:
        <Link href="/users/[address]" as={`/users/${data?.owner}`} passHref>
          <a className="hover:text-indigo-600 dark:text-white text-black">
            {isOwner ? ' You' : ` ${data?.owner}`}
          </a>
        </Link>
      </p>
    </div>
  );
}