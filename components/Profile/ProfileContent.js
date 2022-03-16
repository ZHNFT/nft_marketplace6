import { useRouter } from 'next/router';
import { NFT_LISTING_STATE } from '../../constants/nft';
import Gallery from '../Gallery/Gallery';
import Activity from './Activity';
import { transformGalleryItems } from '../../Utils/helper';

export default function ProfileContent({ data }) {
  const { query: { tab } } = useRouter();

  if (tab === 'activity') {
    return <Activity />;
  }

  if (tab === 'offers') {
    return <div>Offers content here</div>;
  }

  if (tab === 'auction') {
    return <Gallery items={transformGalleryItems(data?.auctioned)} />
  }

  // default content
  return <Gallery items={transformGalleryItems(data?.results)} />;
}
