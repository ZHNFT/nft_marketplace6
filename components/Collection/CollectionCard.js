import Image from "next/image";
import { ellipseAddress } from "../../Utils";
import DefaultLogo from "../../images/default-collection-logo.png";
import yellowph from "../../images/nftObject.png";
import nft1 from "../../images/nfts/nft1.png";
import nft2 from "../../images/nfts/nft2.jpg";
import nft3 from "../../images/nfts/nft3.png";
import nft4 from "../../images/nfts/nft4.png";
import nft5 from "../../images/nfts/nft5.jpg";
import nft6 from "../../images/nfts/nft6.png";
import nft7 from "../../images/nfts/nft7.png";
import {
  LinkIcon,
  InstagramIcon,
  TwitterIcon,
  ShareIcon,
  BeeIcon,
} from "../icons";

import { MailIcon, PhoneIcon } from "@heroicons/react/solid";

import { getExplorer } from "../../config";
const person = {
  name: "Jane Cooper",
  title: "Paradigm Representative",
  role: "Admin",
  email: "janecooper@example.com",
  telephone: "+1-202-555-0170",
  imageUrl:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=4&w=256&h=256&q=60",
};
// More people...
export default function CollectionCard({ collection }) {
  // const options = { address: "0xd...07", chain: "bsc" };

  // const getMetaData = async(options) => {
  //   Moralis.start()
  //   await Moralis.Web3API.token.getNFTMetadata(options);
  // }
  // const metaData = getMetaData(options)
  //   const {
  //     address,
  //     createdAt,
  //     name,
  //     description,
  //     logo,
  //     totalSupply,
  //     socials,
  //     chainIdHex,
  //   } = data;
  // console.log("data:", data);
  // const nft_image_url = "https://ipfs.moralis.io:2052/ipfs/QmQNyLJBN2jWea1DFHjxV5wCYzriavmUEn4XPym5gbtxkV"
  // const nft_image_url = "https://assets.nftrade.com/image/upload/w_500,c_scale/v1643590584/evm_43114_0x6a2b2e8123a046e643faf2cb78d86eb4e8496d2f_7707.png"
  return (
    <>
      {/* <div className="static group block w-96 aspect-[31/30] rounded-lg bg-gray-900 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-indigo-500 overflow-hidden"> */}
      <div className="relative max-w-[555px] w-full rounded-3xl bg-gray-900 ">
        <div className="relative w-full h-full z-0 text-white">
          <div className="aspect-w-4 aspect-h-4 rounded-xl overflow-hidden">
            <Image
              className="object-center object-cover"
              src={nft1}
              alt="NFT Image"
              layout="fill"
              resizemode="contain"
              priority={true}
            />
          </div>
          <div className="absolute bottom-16 left-4 z-30 overflow-visible bg-gunmetal  rounded-full p-5 w-[100] h-[100] content-center">
            <Image
              className=""
              width={81}
              height={81}
              src={DefaultLogo}
              priority={true}
            />
          </div>
          <div className="absolute bottom-0 z-10 overflow-visible bg-gunmetal w-full h-36 content-center rounded-b-3xl"></div>
          <div className="absolute bottom-16 left-40 z-30 text-sm ">
            <p className="font-semibold text-xl">{collection.name}</p>
            <p className="text-manatee text-xs">{collection.address}</p>
          </div>
          <div className="absolute bottom-7 left-5 z-30 text-sm">
            <p className="text-manatee text-xs">{collection.description}</p>
          </div>
          <div className="absolute bottom-6 right-5 z-40">
            <button
              className="
            inline-flex items-center px-2.5 py-1.5 border 
            border-manatee shadow-sm text-xs font-medium 
            rounded-full text-white bg-white bg-opacity-5 border-opacity-25 border hover:bg-gray-50 
            focus:outline-none focus:ring-2 focus:ring-offset-2 
            focus:ring-indigo-500"
            >
              View Collection
            </button>
          </div>
          <div className="absolute text-white text-sm relative bottom-36 w-full h-12 backdrop-blur-[30px] bg-black/[0.3] rounded-lg z-20 p-1">
            <div className="font-sans font-normal flex items-center h-10">
              <div className="flex-1 w-32 h-5  py-3.5"></div>
              <div className="flex-none w-32 h-5">
                <span>Owners:</span>
                <span className="font-semibold"> 24k</span>
              </div>
              <div className="flex-none w-32 h-5 ">
                <span>Volume</span> <BeeIcon className="w-[20px] h-[20px]" />
                <span className="font-semibold">{collection.volume.total}</span>
              </div>
              <div className="flex-none w-32 h-5 ">
                <span>
                  Floor <BeeIcon className="w-[20px]  h-[20px]" />{" "}
                  {collection.floor} 1.0
                </span>
              </div>
            </div>
          </div>
          <div className=" text-white absolute bottom-[86px] right-5 w-full">
            <div className="border-0 flex gap-2">
              <div className="flex-1 px-5 py-0.5 z-50"></div>
              <div className="flex-none px-3  py-0.5  text-xs font-medium bg-white bg-opacity-5 rounded-full z-50">
                <span>Utility</span>
              </div>
              <div className="flex-none px-3 py-0.5  text-xs font-medium bg-white bg-opacity-5 rounded-full z-50">
                <span>% listed</span>
              </div>
              <div className="flex-none px-3 py-0.5 text-xs font-medium  bg-white bg-opacity-5 rounded-full z-50">
                <span>:eye: 9k</span>
              </div>
            </div>
            {/* <p className="text-white  p-3 left-24">Owners: --</p>
            <p className="text-white absolute p-3 left-60">Supply: {collection.totalSupply}</p>
            <p className="text-white absolute p-3 left-96">Volume: {collection.volume.total}</p> backdrop-blur-[1000px]*/}
          </div>
          <div className=" absolute top-5 right-5 w-16 h-[357px] rounded-lg  backdrop-blur-[20px] bg-black/[0.3] z-10">
            <div className="grid grid-cols-1 place-content-stretch p-2 border-0 gap-2 w-full h-full rounded-lg">
              <div className="w-12 h-12 bg-black rounded-md overflow-clip">
                <Image
                  className="object-top"
                  src={nft1}
                  alt="NFT Image" //layout="fill"
                />
              </div>
              <div className="w-12 h-12 bg-black rounded-md overflow-clip">
                <Image
                  className="object-top"
                  src={nft2}
                  alt="NFT Image" //layout="fill"
                />
              </div>
              <div className="w-12 h-12 bg-black rounded-md overflow-clip">
                <Image
                  className="object-top"
                  src={nft3}
                  alt="NFT Image" //layout="fill"
                />
              </div>
              <div className="w-12 h-12 bg-black rounded-md overflow-clip">
                <Image
                  className="object-top"
                  src={nft4}
                  alt="NFT Image" //layout="fill"
                />
              </div>
              <div className="w-12 h-12 bg-black rounded-md overflow-clip">
                <Image
                  className="object-top"
                  src={nft5}
                  alt="NFT Image" //layout="fill"
                />
              </div>
              <div className="w-12 h-12 rounded-md text-center whitespace">
                <div>
                  <span className="font-bold text-xs">48,000</span>
                </div>
                <div className="-my-2">
                  <span className="font-light text-xs">Items</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* <button type="button" className="absolute inset-0 focus:outline-none">
          <span className="sr-only">View details for</span>
        </button> */}
      </div>
      {/* <div className="col-span-1 flex flex-col text-center bg-white rounded-lg shadow divide-y divide-gray-200 bg-white w-64">
        <div className="flex-1 flex flex-col p-8">
          <img
            className="w-32 h-32 flex-shrink-0 mx-auto rounded-full"
            src={person.imageUrl}
            alt=""
          />
          <h3 className="mt-6 text-gray-900 text-sm font-medium">
            {person.name}
          </h3>
          <dl className="mt-1 flex-grow flex flex-col justify-between">
            <dt className="sr-only">Title</dt>
            <dd className="text-gray-500 text-sm">{person.title}</dd>
            <dt className="sr-only">Role</dt>
            <dd className="mt-3">
              <span className="px-2 py-1 text-green-800 text-xs font-medium bg-green-100 rounded-full">
                {person.role}
              </span>
            </dd>
          </dl>
        </div>
        <div>
          <div className="-mt-px flex divide-x divide-gray-200">
            <div className="w-0 flex-1 flex">
              <a
                href={`mailto:${person.email}`}
                className="relative -mr-px w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-bl-lg hover:text-gray-500"
              >
                <MailIcon
                  className="w-5 h-5 text-gray-400"
                  aria-hidden="true"
                />
                <span className="ml-3">Email</span>
              </a>
            </div>
            <div className="-ml-px w-0 flex-1 flex">
              <a
                href={`tel:${person.telephone}`}
                className="relative w-0 flex-1 inline-flex items-center justify-center py-4 text-sm text-gray-700 font-medium border border-transparent rounded-br-lg hover:text-gray-500"
              >
                <PhoneIcon
                  className="w-5 h-5 text-gray-400"
                  aria-hidden="true"
                />
                <span className="ml-3">Call</span>
              </a>
            </div>
          </div>
        </div>
      </div> */}
    </>
  );
}
