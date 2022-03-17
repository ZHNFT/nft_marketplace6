import { useRouter } from 'next/router';
import { NFT_LISTING_STATE } from '../../constants/nft';
import Gallery from '../Gallery/Gallery';
import Activity from './Activity';

export default function ProfileContent({ data }) {
  const { query: { tab } } = useRouter();
  console.log(`data`, data)

  if (tab === 'activity') {
    return <Activity />;
  }

  if (tab === 'offers') {
    return <div>Offers content here</div>;
  }

  if (tab === 'auction') {
    return <Gallery items={data?.auctioned} listing="auctioned" />
  }

  // default content
  return <Gallery items={data?.results} />;
}
