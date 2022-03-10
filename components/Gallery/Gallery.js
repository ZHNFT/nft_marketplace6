import GalleryItem from './GalleryItem';

export default function Gallery({ items }) {
  return (
    <div className="grid justify-center sm:grid-cols-2 sm:justify-between md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mx-auto">
      {
        items?.map((item, index) => <GalleryItem key={index} item={item} />)
      }
    </div>
  );
}