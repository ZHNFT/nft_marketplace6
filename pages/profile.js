import Image from 'next/image'
import { LinkIcon, InstagramIcon, TwitterIcon, ShareIcon, BeeIcon } from '../components/icons';

// test user
const user = {
  name: 'Chelsea Hagon',
  email: 'chelseahagon@example.com',
  imageUrl:
    'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  address: '0x83..c585',
  instagram: 'bobgeldof',
  twitter: 'bobgeldof'
};

export default function Profile() {
  return (
    <section className="lg:grid lg:grid-cols-12 flex relative text-white justify-between flex-col lg:flex-row mt-32 mb-28">
      <div className="flex lg:col-span-7">
        <div className="mr-2.5">
          <div className="gradient-border relative p-2.5">
            <div className="rounded-full border border-white overflow-hidden w-[54px] h-[54px]">
                <Image className="h-8 w-8" src={user.imageUrl} alt="Profile photo" width={"100%"} height={"100%"} />
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <h1 className="text-2xl lg:text-4xl xl:text-6xl mb-2">{ user.name }</h1>
          <ul className="flex justify-start items-center text-xs">
              <li className="mr-6">
                  <a href="#" className="rounded pt-1 pb-0.5 px-2.5 bg-white bg-opacity-10">
                    { user.address }
                    <LinkIcon className="w-[11px] ml-2 relative -top-[1px]" />
                  </a>
              </li>
              {
                user.instagram && (
                  <li className="mr-6">
                    <a href="#">
                      <InstagramIcon className="w-[18px] mr-2" />
                      { user.instagram }
                    </a>
                  </li>
                )
              }
              {
                user.twitter && (
                  <li className="mr-6">
                    <a href="#">
                      <TwitterIcon className="w-[19px] mr-2" />
                      { user.twitter }
                    </a>
                  </li>
                )
              }
              <li>
                  <a href="#">
                    <span className="hidden">Share</span>
                    <ShareIcon className="w-[14px]" />
                  </a>
              </li>
          </ul>
        </div>
      </div>
      <div className="lg:col-span-5 pt-1.5">
          <ul className="flex text-center justify-between">
              <li>
                  <h4 className="text-xs mb-1.5">Items</h4>
                  <span className="text-xl font-medium">12</span>
              </li>
              <li>
                  <h4 className="text-xs mb-1.5">Transactions</h4>
                  <span className="text-xl font-medium">28</span>
              </li>
              <li>
                  <h4 className="text-xs mb-1.5">Volume</h4>
                  <span className="text-xl font-medium">
                    <BeeIcon className="w-[19px] mr-2" />
                    16.7K
                  </span>
              </li>
              <li>
                  <h4 className="text-xs mb-1.5">Est. Value</h4>
                  <span className="text-xl font-medium">
                    <BeeIcon className="w-[19px] mr-2" />
                    16.7K
                  </span>
              </li>
          </ul>
      </div>
    </section>
  );
}
