export default function Tabs({ list, tabComponent: Tab, ...rest }) {
  return (
    <ul className="w-full flex text-center text-base">
      {
        list.map(({ href, name }, index) => (
          <li key={index} className="mr-10 last:mr-0">
            <Tab
              href={href}
              name={name}
              {...rest}
            />
          </li>
        ))
      }
    </ul>
  );
}