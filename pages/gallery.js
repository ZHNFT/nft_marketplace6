import Image from 'next/image'

import yellowph from "../images/nftObject.png";
import redph from "../images/nftph.png";
import AddGalleryObjects from './components/addGalleryObject';
import SearchBar from './components/searchbar';


export default function Gallery() {

    let test1 = {
        name: "nft 1",
        collection: "collection 1",
        price: 0.5, 
        image: redph
      };
      let test2 = {
        name: "nft 2",
        collection: "collection 1",
        price: 0.2, 
        image: redph
      };
      let test3 = {
        name: "nft 3",
        collection: "collection 1",
        price: 0.7, 
        image: redph
      };
      let test4 = {
        name: "nft 1",
        collection: "collection 2",
        price: 0.8, 
        image: yellowph
      };
      let test5 = {
        name: "nft 2",
        collection: "collection 2",
        price: 0.1, 
        image: yellowph
      };
      let test6 = {
        name: "nft 3",
        collection: "collection 2",
        price: 0.2, 
        image: yellowph
      };

      let nfts = [test1, test2, test3, test4, test5, test6];

    return(
        <div className="bg-white">
            <div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
                <h2 className="text-2xl font-extrabold tracking-tight text-gray-900">Collection Gallery</h2>
                {SearchBar()}

                <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {AddGalleryObjects(nfts)}

                </div>
            </div>
        </div>

    )
}