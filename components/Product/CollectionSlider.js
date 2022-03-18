import Slider from '../Slider/Slider';
import GalleryItem from '../Gallery/GalleryItem';
import { transformGalleryItem } from '../../Utils/helper';

export default function CollectionSlider({ items }) {
  return (
    <Slider className="mt-5">
      {
        items?.map((item, index) => <GalleryItem key={index} item={transformGalleryItem(item)} showRarity />)
      }
    </Slider>
  )
};