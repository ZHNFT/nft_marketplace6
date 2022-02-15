import { useState } from 'react';
import { FireIcon, HomeIcon, TrendingUpIcon, UserGroupIcon } from '@heroicons/react/outline'

// Components
import Header from './components/header';
import Sidebar from './components/sidebar';
import List from './components/list';
import Filters from './components/Filters';

const user = {
  name: 'Chelsea Hagon',
  email: 'chelseahagon@example.com',
  imageUrl:
    'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
}

const navigation = [
  { name: 'Home', href: '#', icon: HomeIcon, current: true },
  { name: 'Popular', href: '#', icon: FireIcon, current: false },
  { name: 'Communities', href: '#', icon: UserGroupIcon, current: false },
  { name: 'Trending', href: '#', icon: TrendingUpIcon, current: false },
]
const userNavigation = [
  { name: 'Your Profile', href: '#' },
  { name: 'Settings', href: '#' },
  { name: 'Sign out', href: '#' },
]

const communities = [
  { name: 'Movies', href: '#' },
  { name: 'Food', href: '#' },
  { name: 'Sports', href: '#' },
  { name: 'Animals', href: '#' },
  { name: 'Science', href: '#' },
  { name: 'Dinosaurs', href: '#' },
  { name: 'Talents', href: '#' },
  { name: 'Gaming', href: '#' },
]

const items = [
  {
    id: 1,
    name: 'Fusion',
    category: 'UI Kit',
    href: '#',
    price: '$49',
    imageSrc: 'https://pbs.twimg.com/media/FKyjEh4VkAAKgYV?format=jpg&name=large',
    imageAlt:
      'Payment application dashboard screenshot with transaction table, financial highlights, and main clients on colorful purple background.',
  },
  {
    id: 2,
    name: 'Fusion',
    category: 'UI Kit',
    href: '#',
    price: '$49',
    imageSrc: 'https://pbs.twimg.com/media/FKyjFyPVEAAYf3o?format=jpg&name=large',
    imageAlt:
      'Payment application dashboard screenshot with transaction table, financial highlights, and main clients on colorful purple background.',
  },
  {
    id: 3,
    name: 'Fusion',
    category: 'UI Kit',
    href: '#',
    price: '$49',
    imageSrc: 'https://pbs.twimg.com/media/FKyjImbVgAEIISU?format=jpg&name=large',
    imageAlt:
      'Payment application dashboard screenshot with transaction table, financial highlights, and main clients on colorful purple background.',
  },
  {
    id: 4,
    name: 'Fusion',
    category: 'UI Kit',
    href: '#',
    price: '$49',
    imageSrc: 'https://pbs.twimg.com/media/FKyjEh4VkAAKgYV?format=jpg&name=large',
    imageAlt:
      'Payment application dashboard screenshot with transaction table, financial highlights, and main clients on colorful purple background.',
  },
  {
    id: 5,
    name: 'Fusion',
    category: 'UI Kit',
    href: '#',
    price: '$49',
    imageSrc: 'https://pbs.twimg.com/media/FKyjEh4VkAAKgYV?format=jpg&name=large',
    imageAlt:
      'Payment application dashboard screenshot with transaction table, financial highlights, and main clients on colorful purple background.',
  },
  {
    id: 6,
    name: 'Fusion',
    category: 'UI Kit',
    href: '#',
    price: '$49',
    imageSrc: 'https://pbs.twimg.com/media/FKyjFyPVEAAYf3o?format=jpg&name=large',
    imageAlt:
      'Payment application dashboard screenshot with transaction table, financial highlights, and main clients on colorful purple background.',
  },
  {
    id: 7,
    name: 'Fusion',
    category: 'UI Kit',
    href: '#',
    price: '$49',
    imageSrc: 'https://pbs.twimg.com/media/FKyjImbVgAEIISU?format=jpg&name=large',
    imageAlt:
      'Payment application dashboard screenshot with transaction table, financial highlights, and main clients on colorful purple background.',
  },
  {
    id: 8,
    name: 'Fusion',
    category: 'UI Kit',
    href: '#',
    price: '$49',
    imageSrc: 'https://pbs.twimg.com/media/FKyjEh4VkAAKgYV?format=jpg&name=large',
    imageAlt:
      'Payment application dashboard screenshot with transaction table, financial highlights, and main clients on colorful purple background.',
  },
]

const subCategories = [
  { name: 'Totes', href: '#' },
  { name: 'Backpacks', href: '#' },
  { name: 'Travel Bags', href: '#' },
  { name: 'Hip Bags', href: '#' },
  { name: 'Laptop Sleeves', href: '#' },
]

const filters = [
  {
    id: 'color',
    name: 'Color',
    options: [
      { value: 'white', label: 'White', checked: false },
      { value: 'beige', label: 'Beige', checked: false },
      { value: 'blue', label: 'Blue', checked: true },
      { value: 'brown', label: 'Brown', checked: false },
      { value: 'green', label: 'Green', checked: false },
      { value: 'purple', label: 'Purple', checked: false },
    ],
  },
  {
    id: 'category',
    name: 'Category',
    options: [
      { value: 'new-arrivals', label: 'New Arrivals', checked: false },
      { value: 'sale', label: 'Sale', checked: false },
      { value: 'travel', label: 'Travel', checked: true },
      { value: 'organization', label: 'Organization', checked: false },
      { value: 'accessories', label: 'Accessories', checked: false },
    ],
  },
  {
    id: 'size',
    name: 'Size',
    options: [
      { value: '2l', label: '2L', checked: false },
      { value: '6l', label: '6L', checked: false },
      { value: '12l', label: '12L', checked: false },
      { value: '18l', label: '18L', checked: false },
      { value: '20l', label: '20L', checked: false },
      { value: '40l', label: '40L', checked: true },
    ],
  },
]

const sortOptions = [
  { name: 'Most Popular', href: '#', current: true },
  { name: 'Best Rating', href: '#', current: false },
  { name: 'Newest', href: '#', current: false },
  { name: 'Price: Low to High', href: '#', current: false },
  { name: 'Price: High to Low', href: '#', current: false },
]

const openSeaApi = 'https://api.opensea.io/api/v1/collection/boredapeyachtclub';

export default function Home(props) {
  const { traits } = props;
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  console.log(`traits`, traits)
  return (
    <div className="min-h-full">
      <Header
        user={user}
        navigation={navigation}
        userNavigation={userNavigation}
      />
      <div className="py-10">
        <div className="max-w-3xl mx-auto sm:px-6 lg:max-w-8xl lg:px-8 lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Sidebar menu filters for desktop */}
          <Sidebar
            navigation={navigation}
            communities={communities}
            subCategories={subCategories}
            filters={filters}
          />
          <main className="lg:col-span-9 xl:col-span-10">
            <List
              items={items}
              sortOptions={sortOptions}
              setMobileFiltersOpen={setMobileFiltersOpen}
            />
            {/* Sidemenu filters for mobile */}
            <Filters
              subCategories={subCategories}
              filters={filters}
              setMobileFiltersOpen={setMobileFiltersOpen}
              mobileFiltersOpen={mobileFiltersOpen}
            />
          </main>
        </div>
      </div>
    </div>
  );
}

export async function getStaticProps() {
  const res = await fetch(openSeaApi);
  const data = await res?.json();

  const traits = data?.collection?.traits;
  
  return { props: { traits }, revalidate: 30 };
}