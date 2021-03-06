import { Fragment, useState, useEffect, useCallback, useContext } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { Popover, Transition } from '@headlessui/react';
import { BellIcon } from '../icons';
import { resolveBunnyLink } from '../../Utils';
import { usdFormatter, formatEther } from '../../Utils/helper';
import fromUnixTime from 'date-fns/fromUnixTime'
import formatDistanceToNowStrict from 'date-fns/formatDistanceToNowStrict'
import NotFoundImage from "../../images/No-Image-Placeholder.png";
import Web3Context from "../../contexts/Web3Context";
import useAcceptBid from '../../hooks/useAcceptBid';

const NOTIFICATION_TYPES = {
  AUCTION_BID: 'auctionBid'
};

export default function NotificationsButton({ currentUserAddress }) {
  const {
    state: { marketplaceContract, ethersProvider },
  } = useContext(Web3Context);
  const marketplaceAddress = marketplaceContract?.address;
  const [notifications, setNotifications] = useState([]);
  const unreadNotifications = notifications?.results?.filter(item => !item?.read)?.length;

  const fetchData = useCallback(async function() {
    const url = `https://api.hexag0n.io/users/${currentUserAddress}/notifications`;
    const res = await fetch(url)
    const data = await res?.json()
    setNotifications(data);
  }, [currentUserAddress])

  useEffect(() => {
    if (currentUserAddress) {
      fetchData()
    }
  }, [fetchData, currentUserAddress])

  const { handleAcceptBid, acceptBidTx, acceptBidStatus, acceptBidError } = useAcceptBid({ owner: currentUserAddress, marketplaceAddress, ethersProvider, marketplaceContract, fetchData });

  // TODO implement mark as read for notifications
  // https://api.hexag0n.io/notifications/623263eacf269d0412c40f16/mark-as-read
  
  return (
    <Popover className="relative mr-[25px] lg:mr-0">
      {({ open }) => (
        <>
          <Popover.Button
            className="ml-5 flex-shrink-0 rounded-full p-1 hover:text-cornflower dark:border-[0.5px] w-[38px] h-[38px] border-manatee relative"
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
            <Popover.Panel className="absolute z-10 w-[350px] md:w-[450px] -right-[45px] md:right-0 mt-[8px]">
              <div className="popover-container overflow-hidden rounded-[21px] dark:text-manatee text-ink text-xs py-6 px-5">
                <div className="flex justify-between items-center">
                 <h3 className="text-xs font-medium">Notifications</h3>
                 <div className="rounded-full bg-white/[0.05] min-w-[24px] h-6 px-1.5 flex justify-center items-center text-xs font-medium text-white">
                  { unreadNotifications }
                 </div>
                </div>
                <div className="mt-2 max-h-[392px] -ml-[20px] overflow-y-auto scroller">
                  {
                    notifications?.results?.length > 0
                     ? (
                      <ul className="dark:text-white text-ink mr-[10px]">
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
                                      {imageUrl ? (
                                        <Image className="rounded-xl" src={imageUrl} alt={name} height="50" width="50" />
                                        ) : (
                                          <Image
                                            src={NotFoundImage}
                                            alt={item?.tokenId}
                                            className="rounded-xl"
                                            width={"50"}
                                            height={"50"}
                                          />
                                        )}
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
                                      {notificationType === "bid" && info?.active ? (
                                      <button type="button" className="dark:text-[#3CA075] text-cobalt hover:underline" onClick={() => handleAcceptBid(item?.info)}>
                                          Accept
                                        </button>
                                      ) : null}
                                      {/* <button type="button" className="ml-4 text-[#DE5353] hover:underline">
                                        Decline
                                      </button> */}
                                    </p>
                                  </div>
                                  <div className="no-shrink w-[100px] ml-auto text-right">
                                    <span className="absolute right-[10px] top-[15px]">{ formatEther(value) } HNY</span>
                                    {/* TODO formatDistanceToNowStrict(date, { addSuffix: true }) */}
                                    <span className="block absolute right-[10px] bottom-[12px] dark:text-manatee text-ink text-xxs">23m ago</span>
                                  </div>
                                </div>
                              </li> 
                            )
                          })
                        }
                      </ul>
                     )
                     : <p className="my-4 text-center">No notifications found</p>
                  }
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </>
      )}
    </Popover>
  );
}