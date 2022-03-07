import { useRouter } from 'next/router';
import Tab from './Tab';

export default function Tabs({ list }) {
  const { asPath } = useRouter();
  return (
    <ul className="flex text-center text-base justify-between">
      {
        list.map(({ href, name }) => (
          <li>
            <Tab href={href} name={name} isActive={asPath === href} />
          </li>
        ))
      }
    </ul>
  );
}