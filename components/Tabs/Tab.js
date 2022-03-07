import clsx from 'clsx';
import Link from 'next/link';

export default function Tab({ href, isActive, name }) {
  return (
    <Link href={href} scroll={false}>
      <a
        className={clsx(isActive ? 'font-medium' : 'font-light')}
      >
        { name }
      </a>
    </Link>
  );
}