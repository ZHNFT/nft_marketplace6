import Tab from './Tab';

export default function Tabs({ list, total, totalOnAuction, address }) {
  return (
    <ul className="w-full flex text-center text-base">
      {
        list.map(({ href, name }, index) => (
          <li key={index} className="mr-10 last:mr-0">
            <Tab
              href={href}
              name={name}
              total={total}
              totalOnAuction={totalOnAuction}
              address={address}
            />
          </li>
        ))
      }
    </ul>
  );
}