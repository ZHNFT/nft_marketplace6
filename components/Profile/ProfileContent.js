import { useRouter } from 'next/router';
import Gallery from '../Gallery/Gallery';
import Activity from './Activity';
import InfiniteGallery from '../../components/Gallery/InfiniteGallery';
import Offers from './Offers'

export default function ProfileContent({ data, offers, tokenPriceUsd }) {
  const { query: { tab } } = useRouter();

  if (tab === 'activity') {
    return <Activity tokenPriceUsd={tokenPriceUsd} />;
  }

  if (tab === 'offers') {
    return <Offers tokenPriceUsd={tokenPriceUsd} />
  }

  if (tab === 'auction') {
    return <Gallery items={data?.auctioned} listing="auctioned" />
  }

  // default content
  return <InfiniteGallery className="grid-cols-2 lg:grid-cols-4 xl:grid-cols-5" collectionData={data} />;
}
