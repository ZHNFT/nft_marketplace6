import { useState } from 'react';
import ProfileHeader from '../components/Profile/ProfileHeader';
import ProfileContent from '../components/Profile/ProfileContent';
import Tabs from '../components/Tabs/Tabs';
import FilterButton from '../components/FilterButton/FilterButton';
import Dropdown from '../components/Dropdown/Dropdown';

// test user
const user = {
  name: 'Chelsea Hagon',
  email: 'chelseahagon@example.com',
  imageUrl:
    'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  address: '0x83..c585',
  instagram: 'bobgeldof',
  twitter: 'bobgeldof'
};

const itemsFilterList = [
  { label: 'All items' },
  { label: 'Single items' },
  { label: 'Bundles' }
];

const sortList = [
  { label: 'Price: Low to high' },
  { label: 'Price: High to low' }
];

export default function Profile() {
  const tabs = [
    { href: '/profile', name: 'NFTs (12)' },
    { href: '/profile?tab=activity', name: 'Activity' },
    { href: '/profile?tab=offers', name: 'Offers' }
  ];
  const [selectedItemsFilter, setSelectedItemsFilter] = useState(itemsFilterList[0]);
  const [selectedSort, setSelectedSort] = useState(sortList[0]);
  return (
    <>
      <ProfileHeader user={user} />
      <section className="flex flex-col lg:flex-row lg:grid lg:grid-cols-12">
        <div className="flex col-span-12 lg:col-span-7 items-center">
          <Tabs list={tabs} />
        </div>
        <div className="flex lg:col-span-5 items-center justify-end mt-4 lg:mt-0">
          <span className="mr-4"><FilterButton /></span>
          <Dropdown className="mr-4 max-w-[128px]" selected={selectedItemsFilter} onSelect={setSelectedItemsFilter} list={itemsFilterList} />
          <Dropdown className="max-w-[180px]" selected={selectedSort} onSelect={setSelectedSort} list={sortList} />
        </div>
      </section>
      <section className="mt-14">
        <ProfileContent />
      </section>
    </>
  );
}