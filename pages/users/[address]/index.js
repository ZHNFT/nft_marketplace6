import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import ProfileHeader from "../../../components/Profile/ProfileHeader";
import ProfileContent from "../../../components/Profile/ProfileContent";
import Tabs from "../../../components/Tabs/Tabs";
import FilterButton from "../../../components/FilterButton/FilterButton";
import Dropdown from "../../../components/Dropdown/Dropdown";

import AddCollectionModal from "../../../components/Modals/AddCollectionModal";
import { getUserDetails, transformUserData } from "../../../Utils/helper";
import {getUserOffers} from "../../../Utils/helper"
import UserTab from '../../../components/Tabs/UserTab';

const itemsFilterList = [
  { label: "All items" },
  { label: "For Sale" },
  { label: "Auction" },
  { label: "Has Offers" },
  { label: "Not Listed" },
];

const sortList = [
  { label: "Price: Low to high" },
  { label: "Price: High to low" },
];

export default function UserAssets(props) {
  const { chainIdHex, data: serverData, tokenData, shouldRefetch, handleCloseModal, setShouldRefetch, setIsRefetching } = props;
  const router = useRouter();
  const { address, tab } = router.query;
  const [data, setData] = useState(serverData)

  const tabs = [
    { href: "", name: "NFTs" },
    { href: "?tab=activity", name: "Activity" },
    { href: "?tab=offers", name: "Offers" },
    { href: "?tab=auction", name: "On Auction" },
  ];
  const total = data?.total;
  const totalOnAuction = data?.auctioned?.length;
  const [userData, setUserData] = useState({});

  useEffect(() => {
    async function getUserData() {
      const data = await getUserDetails(address);
      setUserData(transformUserData(data.user));
    }
    getUserData()
  }, [address]);

  const fetchData = useCallback(async function() {
    const url = `https://api.hexag0n.io/users/${address}/tokens`;
    const res = await fetch(url)
    const data = await res?.json()

    setData(data);
  }, [address])

  useEffect(() => {
    let timer;
    if (shouldRefetch) {
      setIsRefetching(true);
      timer = setTimeout(() => {
        fetchData();
        setShouldRefetch(false)
        setIsRefetching(false)
        handleCloseModal();
      }, 4000)
    }
    return () => clearTimeout(timer);
  }, [shouldRefetch, fetchData, handleCloseModal, setShouldRefetch, setIsRefetching])

  return (
    <>
      <div className="lg:max-w-6xl mx-auto">
        <ProfileHeader
          chainIdHex={chainIdHex}
          userData={userData}
          address={address}
          total={total}
        />
        <section className="flex flex-col lg:flex-row lg:grid lg:grid-cols-12">
          <div className="flex col-span-12 lg:col-span-7 items-center">
            <Tabs
              list={tabs}
              total={total}
              totalOnAuction={totalOnAuction}
              address={address}
              tabComponent={UserTab}
            />
          </div>
          <div className="flex lg:col-span-5 items-center justify-end mt-4 lg:mt-0">
            {/*}
              <>
                <span className="mr-4">
                  <FilterButton />
                </span>
                <Dropdown
                  className="mr-4 max-w-[128px]"
                  size="sml"
                  selected={selectedItemsFilter}
                  onSelect={setSelectedItemsFilter}
                  list={itemsFilterList}
                />
                <Dropdown
                  className="max-w-[180px]"
                  size="sml"
                  selected={selectedSort}
                  onSelect={setSelectedSort}
                  list={sortList}
                />
              </>
  */}
          </div>
        </section>
        <section className="mt-14">
          <ProfileContent data={data} tokenPriceUsd={tokenData?.priceUsd} />
        </section>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const {
    params: { address },
  } = context;
  const url = `https://api.hexag0n.io/users/${address}/tokens`;
  const res = await fetch(url);
  const data = await res?.json();

  return { props: { data } };
}
