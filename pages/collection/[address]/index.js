import { useRouter } from 'next/router'

// Components
import List from '../../components/list';

const sortOptions = [
  { name: 'Most Popular', href: '#', current: true },
  { name: 'Best Rating', href: '#', current: false },
  { name: 'Newest', href: '#', current: false },
  { name: 'Price: Low to High', href: '#', current: false },
  { name: 'Price: High to Low', href: '#', current: false },
]

// This will be the Single collection page (NFT collection)
// Route: http://localhost:3000/collection/[address]
// Example: http://localhost:3000/collection/0xdbe147fc80b49871e2a8d60cc89d51b11bc88b35
export default function Collection(props) {
  const { data, setMobileFiltersOpen } = props;
  const router = useRouter()
  const { address } = router.query

  return (
    <List
      items={data?.result}
      sortOptions={sortOptions}
      setMobileFiltersOpen={setMobileFiltersOpen}
    />
  );
}

export async function getServerSideProps(context) {
  const { params: { address } } = context;
  const res = await fetch(`http://localhost:3000/api/collection/${address}`);
  const data = await res?.json();
  
  return { props: { data: data?.data } };
}