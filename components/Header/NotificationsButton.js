import { Fragment, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { Popover, Transition } from '@headlessui/react';
import { BellIcon } from '../icons';
import { resolveBunnyLink } from '../../Utils';
import { usdFormatter, formatEther } from '../../Utils/helper';
import fromUnixTime from 'date-fns/fromUnixTime'
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict'

const NOTIFICATION_TYPES = {
  AUCTION_BID: 'auctionBid'
};

export default function NotificationsButton({ currentUserAddress }) {
  const [notifications, setNotifications] = useState([]);
  const unreadNotifications = notifications?.results?.filter(item => !item?.read)?.length;

  const fetchData = useCallback(async function() {
    const url = `https://hexagon-api.onrender.com/users/${currentUserAddress}/notifications`;
    const res = await fetch(url)
    const data = await res?.json()
    setNotifications(data);
  }, [currentUserAddress])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  // TODO implement mark as read for notifications
  // https://hexagon-api.onrender.com/notifications/623263eacf269d0412c40f16/mark-as-read
  
  return (
    <Popover className="relative">
      {({ open }) => (
        <>
          <Popover.Button
            className="ml-5 flex-shrink-0 rounded-full p-1 hover:text-cornflower border-[0.5px] w-[38px] h-[38px] border-manatee relative"
          >
            <span className="sr-only">View notifications</span>
            <BellIcon className="w-[24px] pb-1.5 absolute mx-auto top-0 left-[8px]" />
            {
              unreadNotifications > 0 && (
                <div className="block w-[8px] h-[8px] bg-cornflower rounded-full absolute top-[10px] right-[10px]">
                  <span className="sr-only">You have { unreadNotifications } unread notifications</span>
                </div>
              )
            }
          </Popover.Button>
          <Transition
            as={Fragment}
          >
            <Popover.Panel className="absolute z-10 lg:w-[450px] right-0 mt-[8px]">
              <div className="popover-container overflow-hidden rounded-[21px] text-manatee text-xs py-6 px-5">
                <div className="flex justify-between items-center">
                 <h3 className="text-xs text-manatee font-medium">Notifications</h3>
                 <div className="rounded-full bg-white/[0.05] min-w-[24px] h-6 px-1.5 flex justify-center items-center text-xs font-medium text-white">
                  { unreadNotifications }
                 </div>
                </div>
                <div className="mt-2 max-h-[392px] -ml-[20px] overflow-y-auto scroller">
                  <ul className="text-white mr-[10px]">
                    {
                      notifications?.results?.map(item => {
                        const { info, read, message, notificationType, receiver, value, _id } = item;
                        const { tokenImage, tokenId } = info;
                        const imageUrl = resolveBunnyLink(tokenImage);
                        return (
                          <li key={_id}>
                            <div className={clsx(
                              'ml-[10px] relative flex items-center justify-between my-1 hover:bg-white/[0.05] py-2.5 px-2.5 rounded-md',
                              !read ? 'before:bg-cornflower before:block before:w-[3px] before:h-[30px] before:absolute before:-left-[10px] before:rounded-r-md before:top-[20px]' : ''
                            )}>
                              <div className="relative">
                                <div className="rounded-xl overflow-hidden" >
                                  <Image className="rounded-xl" src={imageUrl} alt={name} height="50" width="50" />
                                </div>
                                { currentUserAddress === receiver && <span className="absolute">Owner</span> }
                                { true && <span className="text-xxs absolute -bottom-[5px] left-[4px] mx-auto bg-[#2A2F37] py-[1px] px-1.5 rounded-xl">Owner</span> }
                              </div>
                              <div className="ml-4 mr-2 leading-[18px]">
                                <p>
                                  <span>{message}</span>
                                  {/* <Link href={`/users/[address]`} as={`/users/${address}`} passHref>
                                    <a className="text-cornflower hover:underline">{ name }</a>
                                  </Link> */}
                                </p>
                                <p>
                                  <button type="button" className="text-[#3CA075] hover:underline">
                                    Accept
                                  </button>
                                  <button type="button" className="ml-4 text-[#DE5353] hover:underline">
                                    Decline
                                  </button>
                                </p>
                              </div>
                              <div className="no-shrink w-[100px] ml-auto text-right">
                                <span className="absolute right-[10px] top-[15px]">{ formatEther(value) } HNY</span>
                                {/* formatDistanceToNowStrict(date, { addSuffix: true }) */}
                                <span className="block absolute right-[10px] bottom-[12px] text-manatee text-xxs">23m ago</span>
                              </div>
                            </div>
                          </li> 
                        )
                      })
                    }
                  </ul>
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}