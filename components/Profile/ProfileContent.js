import { useRouter } from 'next/router';
import Gallery from '../Gallery/Gallery';
import Activity from './Activity';
import InfiniteGallery from '../../components/Gallery/InfiniteGallery';

export default function ProfileContent({ data, tokenPriceUsd }) {
  const { query: { tab } } = useRouter();

  if (tab === 'activity') {
    return <Activity tokenPriceUsd={tokenPriceUsd} />;
  }

  if (tab === 'offers') {
    return <div>Offers content here</div>;
  }

  if (tab === 'auction') {
    return <Gallery items={data?.auctioned} listing="auctioned" />
  }

  // default content
  return <InfiniteGallery collectionData={data} />;
}
