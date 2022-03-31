import clsx from 'clsx';
import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Tab({ href, name, total, totalOnAuction, address }) {
  const { asPath } = useRouter();
  const route = `/collections/${address}${href}`
  const isActive = asPath === route;

  return (
    <Link href={route} scroll={false} passHref>
      <a
        className={clsx(isActive ? 'font-medium' : 'font-light')}
      >
        { name }
      </a>
    </Link>
  );
}