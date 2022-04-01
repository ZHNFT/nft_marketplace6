//import styles from '../styles/Home.module.css'
import Hero from '../components/Home/Hero';
import HeroCards from '../components/Home/HeroCards';
import CollectionCard from '../components/Collection/CollectionCard'

// TODO REPLACE with Real data
const featuredCollections = [
  {
    id: 1,
    address: '0x1fa2f83ba2df61c3d370071d61b17be01e224f3a',
    name: 'Bee Collection',
    author: 'Hive Investments',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore...',
    totalSupply: 48000,
    owners: 36100,
    volume: 16700,
    floorPrice: 23.4,
    listed: 25
  }
];

export default function Home(props) {
  const { collections } = props;

  if (!collections && !collections?.length) {
    return  (
      <h1 className='px-20 py-10 text-3xl'>No items in Marketplace</h1>
    )
  }

  return (
    <div className="flex justify-center lg:max-w-6xl mx-auto">

      <div className="px-4">
        <div className="flex flex-col">
          <Hero />
          <HeroCards />

          <section className="mt-14 mb-10">
            <h2 className="text-center text-[22px] font-medium mb-6 gradient-text">Featured collections</h2>
            <ul role="list" className="grid grid-cols-1 gap-x-6 gap-y-8">
                {featuredCollections?.map((collection, index) => (
                  <li
                    key={`${collection.id}_${index}`}
                    className="mx-auto w-full">
                    <CollectionCard collection={collection} />
                  </li>
                ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}

export async function getStaticProps() {
  const url = "https://hexagon-api.onrender.com/collections?page=0&size=2&sort=name&chain=mumbai"
  const res = await fetch(url)
  const data = await res?.json()
  return { props: { collections: data }, revalidate: 30 };
}
