//import styles from '../styles/Home.module.css'
import Hero from '../components/Home/Hero';
import HeroCards from '../components/Home/HeroCards';
import CollectionCard from '../components/Collection/CollectionCard'
import { useState, useCallback, useEffect } from 'react';


export default function Home(props) {


  const [featuredCollections, setCollections] = useState([]);

  const fetchData = useCallback(async function() {
    //TODO: quer multiple collections
    const url = `https://hexagon-api.onrender.com/collections/0x16c3fbda29713b1766128980b65d92807151d710`;
    const res = await fetch(url)
    const data = await res?.json()
    console.log("data")
    console.log(data)

    let array = [data]
    setCollections(array);

  }, [])

  useEffect(() => {
    fetchData()
  }, [])

  const { collections, connect, address } = props;
  console.log(`collections`, collections)

  if (!collections && !collections?.length) {
    return  (
      <h1 className='px-20 py-10 text-3xl'>No items in Marketplace</h1>
    )
  }

  return (
    <div className="flex justify-center lg:max-w-6xl mx-auto">

      <div>
        <div className="flex flex-col">
          <Hero />
          <HeroCards connect={connect} address={address} />

          <section className="mt-14 mb-10">
            <h2 className="text-center text-[22px] font-medium mb-6 gradient-text">Featured collections</h2>
            <ul role="list" className="grid grid-cols-1 gap-x-6 gap-y-8">
                {featuredCollections?.map((collection, index) => (
                  <li
                    key={`${collection.address}_${index}`}
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
  const chain = process.env.NEXT_PUBLIC_CHAIN;
  const url = `https://hexagon-api.onrender.com/collections?page=0&size=2&sort=name&chain=${chain}`;
  const res = await fetch(url)
  const data = await res?.json()
  return { props: { collections: data }, revalidate: 30 };
}
