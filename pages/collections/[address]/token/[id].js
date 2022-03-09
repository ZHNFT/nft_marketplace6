import { Fragment, useCallback, useState } from 'react'
import { ethers } from "ethers";
import Web3Token from 'web3-token';
import Image from 'next/image'
import clsx from "clsx";
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { StarIcon } from '@heroicons/react/solid'
import { Tab } from '@headlessui/react'
import { resolveLink } from '../../../../Utils';
import { getExplorer } from '../../../../config';
import { getSignatureListing } from '../../../../Utils/marketplaceSignatures';

const product = {
  name: 'Application UI Icon Pack',
  version: { name: '1.0', date: 'June 5, 2021', datetime: '2021-06-05' },
  price: '$220',
  description:
    'The Application UI Icon Pack comes with over 200 icons in 3 styles: outline, filled, and branded. This playful icon pack is tailored for complex application user interfaces with a friendly and legible look.',
  highlights: [
    '200+ SVG icons in 3 unique styles',
    'Compatible with Figma, Sketch, and Adobe XD',
    'Drawn on 24 x 24 pixel grid',
  ],
  imageSrc: 'https://tailwindui.com/img/ecommerce-images/product-page-05-product-01.jpg',
  imageAlt: 'Sample of 30 icons with friendly and fun details in outline, filled, and brand color styles.',
}

const faqs = [
  {
    question: 'What format are these icons?',
    answer:
      'The icons are in SVG (Scalable Vector Graphic) format. They can be imported into your design tool of choice and used directly in code.',
  },
  {
    question: 'Can I use the icons at different sizes?',
    answer:
      "Yes. The icons are drawn on a 24 x 24 pixel grid, but the icons can be scaled to different sizes as needed. We don't recommend going smaller than 20 x 20 or larger than 64 x 64 to retain legibility and visual balance.",
  },
  // More FAQs...
]
const license = {
  href: '#',
  summary:
    'For personal and professional use. You cannot resell or redistribute these icons in their original or modified state.',
  content: `
    <h4>Overview</h4>
    
    <p>For personal and professional use. You cannot resell or redistribute these icons in their original or modified state.</p>
    
    <ul role="list">
    <li>You\'re allowed to use the icons in unlimited projects.</li>
    <li>Attribution is not required to use the icons.</li>
    </ul>
    
    <h4>What you can do with it</h4>
    
    <ul role="list">
    <li>Use them freely in your personal and professional work.</li>
    <li>Make them your own. Change the colors to suit your project or brand.</li>
    </ul>
    
    <h4>What you can\'t do with it</h4>
    
    <ul role="list">
    <li>Don\'t be greedy. Selling or distributing these icons in their original or modified state is prohibited.</li>
    <li>Don\'t be evil. These icons cannot be used on websites or applications that promote illegal or immoral beliefs or activities.</li>
    </ul>
  `,
}

// This will be the Single Asset of a collection (Single NFT)
// Route: http://localhost:3000/collection/[address]/[id]
// Example: http://localhost:3000/collection/0xdbe147fc80b49871e2a8d60cc89d51b11bc88b35/198
export default function Nft({ data, chainIdHex, chainId, address, connect, ethersProvider, marketplaceContract }) {
  const isOwner = data?.owner === address;
  console.log(`data`, data)
  const marketplaceAddress = marketplaceContract?.address;
  const [price, setPrice] = useState(0);
  const [expirationDate, setExpirationDate] = useState(0);

  function handlePriceChange(e) {
    const value = e.target.value;
    console.log(`value`, value)
    setPrice(value)
  }

  function handleDateChange(e) {
    const value = e.target.value;
    console.log(`value.valueOf()`, new Date(value).valueOf())
    console.log(`value.getTime()`, new Date(value).getTime())

    // const unixTime = Math.floor(new Date(value).getTime() / 1000);
    const unixTime = parseInt((new Date(value).getTime() / 1000).toFixed(0));
    setExpirationDate(unixTime)

  }

  const handleListItem = useCallback(async function() {
    if (!isOwner) {
      alert("You are not the ower of this item");
      return;
    }
    const signer = ethersProvider.getSigner();
    const nonce = await signer.getTransactionCount();

    let listing = {
      contractAddress: data.collectionId,
      tokenId: data.tokenId,
      userAddress: data?.owner,
      pricePerItem: price,
      quantity: 1,
      expiry: expirationDate,
      nonce: nonce
    }

    listing = getSignatureListing(listing, signer, ethers, marketplaceAddress, chainId);
    const token = await Web3Token.sign(async msg => await signer.signMessage(msg), '1d');

    const response = await fetch('https://hexagon-api.onrender.com/listings', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ listing })
    });

    console.log(`response`, response)

  }, [ethersProvider, chainId, data.tokenId, data.collectionId, data.owner, isOwner, marketplaceAddress, price, expirationDate])

  return (
    <div className='bg-white'>
      <div className="mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-8xl lg:px-8">
        {/* Product */}
        <div className="lg:grid lg:grid-rows-1 lg:grid-cols-7 lg:gap-x-8 lg:gap-y-10 xl:gap-x-16">
          {/* Product image */}
          <div className="lg:row-end-1 lg:col-span-3">
            <div className="aspect-w-4 aspect-h-4 rounded-lg bg-gray-100 overflow-hidden">
              <Image src={resolveLink(data?.image)} alt={data?.tokenId} className="object-center object-cover" layout="fill" />
            </div>
            <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-900">Share</h3>
                <ul role="list" className="flex items-center space-x-6">
                  <li>
                    <a href="#" className="flex items-center justify-center w-6 h-6 text-gray-400 hover:text-gray-500">
                      <span className="sr-only">Share on Facebook</span>
                      <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center justify-center w-6 h-6 text-gray-400 hover:text-gray-500">
                      <span className="sr-only">Share on Instagram</span>
                      <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                        <path
                          fillRule="evenodd"
                          d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                  </li>
                  <li>
                    <a href="#" className="flex items-center justify-center w-6 h-6 text-gray-400 hover:text-gray-500">
                      <span className="sr-only">Share on Twitter</span>
                      <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                  </li>
                </ul>
              </div>
          </div>

          {/* Product details */}
          <div className="max-w-2xl mx-auto mt-14 sm:mt-16 lg:max-w-none lg:mt-0 lg:row-end-2 lg:row-span-2 lg:col-span-4">
            <div className="flex flex-col">
              <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl">{data?.name}</h1>

              <h2 id="information-heading" className="sr-only">
                NFT information
              </h2>
              <p className="text-sm text-gray-500 mt-2">
                {/* Could also link to profile/account within the market place instead of blockexplorer */}
                Owned by:
                <a href={chainIdHex ? `${getExplorer(chainIdHex)}address/${data?.owner}` : `https://polygon-rpc.com/address/${data?.owner}`} className="hover:text-indigo-600">
                  {isOwner ? ' You' : ` ${data?.owner}`}
                </a>
              </p>
            </div>
            <div className="border-t border-gray-200 mt-10 pt-10">
              <h3 className="text-sm font-medium text-gray-900">Description</h3>
              <div className="mt-4 prose prose-sm text-gray-500">
                <ReactMarkdown
                  className='mt-6 whitespace-pre-line'
                  remarkPlugins={[remarkGfm]}
                  components={{
                    a: ({node, ...props}) => <a {...props} className="text-indigo-600 hover:underline" />,
                    p: ({node, ...props}) => <p {...props} className="text-gray-500" />
                  }}
                >
                  {data?.metadata?.description}
                </ReactMarkdown>
              </div>
            </div>
            <Tab.Group as="div">
              <div className="border-b border-gray-200 border-t border-gray-200 mt-10 ">
                <Tab.List className="-mb-px flex space-x-8">
                  <Tab
                    className={({ selected }) =>
                      clsx(
                        selected
                          ? 'border-indigo-600 text-indigo-600'
                          : 'border-transparent text-gray-700 hover:text-gray-800 hover:border-gray-300',
                        'whitespace-nowrap py-6 border-b-2 font-medium text-sm'
                      )
                    }
                  >
                    Traits
                  </Tab>
                  <Tab
                    className={({ selected }) =>
                      clsx(
                        selected
                          ? 'border-indigo-600 text-indigo-600'
                          : 'border-transparent text-gray-700 hover:text-gray-800 hover:border-gray-300',
                        'whitespace-nowrap py-6 border-b-2 font-medium text-sm'
                      )
                    }
                  >
                    Activity
                  </Tab>
                  <Tab
                    className={({ selected }) =>
                      clsx(
                        selected
                          ? 'border-indigo-600 text-indigo-600'
                          : 'border-transparent text-gray-700 hover:text-gray-800 hover:border-gray-300',
                        'whitespace-nowrap py-6 border-b-2 font-medium text-sm'
                      )
                    }
                  >
                    Details
                  </Tab>
                </Tab.List>
              </div>
              <Tab.Panels as={Fragment}>
                <Tab.Panel className="">
                  <h3 className="sr-only">Traits</h3>
                  <div className="flex flex-col mt-10">
                    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                      <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                          <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                              <tr>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Name/Type
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Property/Value
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Rarity %
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Rarity rank <b className='text-black'>#{data?.rarityRank}</b>
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {data?.traits?.map((attribute) => (
                                <tr key={attribute?.trait_type}>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{attribute?.trait_type}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{attribute?.value}</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{attribute?.rarityPercent.toFixed(2)}%</td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{attribute?.rarityScore.toFixed(2)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </Tab.Panel>

                <Tab.Panel as="dl" className="text-sm text-gray-500">
                  <h3 className="sr-only">Frequently Asked Questions</h3>

                  {faqs.map((faq) => (
                    <Fragment key={faq.question}>
                      <dt className="mt-10 font-medium text-gray-900">{faq.question}</dt>
                      <dd className="mt-2 prose prose-sm max-w-none text-gray-500">
                        <p>{faq.answer}</p>
                      </dd>
                    </Fragment>
                  ))}
                </Tab.Panel>

                <Tab.Panel className="pt-10">
                  <h3 className="sr-only">License</h3>

                  <div
                    className="prose prose-sm max-w-none text-gray-500"
                    dangerouslySetInnerHTML={{ __html: license.content }}
                  />
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>

          <div className="w-full max-w-2xl mx-auto mt-16 lg:max-w-none lg:mt-0 lg:col-span-3">
            <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-5">
              <div className='col-span-2'>
                <label htmlFor="price" className='block text-black'>Price</label>
                <input id="price" type="text" name="price" className="w-full block text-black" onChange={handlePriceChange} />
              </div>
              <div className='col-span-3'>
                <label htmlFor="date" className='block text-black'>Expiration Date</label>
                <input id="date" type="datetime-local" name="date" className="w-full block text-black" onChange={handleDateChange} />
              </div>
              {/* <input type="time" className="text-black col-span-1">
              </input> */}
            </div>
            <div className="grid grid-cols-1 pt-6">
              <button
                  onClick={address ? handleListItem : connect}
                  type="button"
                  className="w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
                >
                  List
                </button>
            </div>
            <div className="border-t border-gray-200 mt-10 pt-10">
              <h3 className="text-sm font-medium text-gray-900">Description</h3>
              <div className="mt-4 prose prose-sm text-gray-500">
                <ReactMarkdown
                  className='mt-6 whitespace-pre-line'
                  remarkPlugins={[remarkGfm]}
                  components={{
                    a: ({node, ...props}) => <a {...props} className="text-indigo-600 hover:underline" />,
                    p: ({node, ...props}) => <p {...props} className="text-gray-500" />
                  }}
                >
                  {data?.metadata?.description}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export async function getServerSideProps(context) {
  const { params: { address, id } } = context;
  const url = `https://hexagon-api.onrender.com/collections/${address}/token/${id}`;
  const res = await fetch(url)
  const data = await res?.json()

  return { props: { data } };
}