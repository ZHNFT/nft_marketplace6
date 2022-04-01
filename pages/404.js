import Link from "next/link";

export default function NotFound(props) {
  return (
    <div className="flex justify-center lg:max-w-6xl mx-auto">

      <div className="px-4">
        <div className="flex flex-col text-center my-28">
          <h1 className="py-2 text-4xl md:text-6xl font-medium gradient-heading leading-normal mb-6 leading-6">
            <span className="text-5xl md:text-6xl">404</span>
            <span className="block text-3xl md:text-5xl">Page not found</span>
          </h1>
          <p className="text-sm text-manatee mb-10">
            We can&lsquo;t seem to find the page you&lsquo;re looking for.
          </p>
          <span>
            <Link href="/">
              <a className="whitespace-nowrap font-medium text-xs rounded-[10px] py-2 px-6 border-[0.5px] border-transparent bg-white/[0.05] border-white hover:border-cornflower hover:bg-white/[0.15]">
                Return home
              </a>
            </Link>
          </span>
        </div>
      </div>
    </div>
  )
}