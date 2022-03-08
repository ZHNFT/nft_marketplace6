import { useRouter } from 'next/router';
import Tab from './Tab';

export default function Tabs({ list }) {
  const { asPath } = useRouter();
  return (
    <ul className="w-full flex text-center text-base">
      {
        list.map(({ href, name }) => (
          <li key={href} className="mr-10 last:mr-0">
            <Tab href={href} name={name} isActive={asPath === href} />
          </li>
        ))
      }
    </ul>
  );
}