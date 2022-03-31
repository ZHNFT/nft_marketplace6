import { useState } from "react";
import { useRouter } from "next/router";
import ProfileHeader from "../../../components/Profile/ProfileHeader";
import ProfileContent from "../../../components/Profile/ProfileContent";
import Tabs from "../../../components/Tabs/Tabs";
import FilterButton from "../../../components/FilterButton/FilterButton";
import Dropdown from "../../../components/Dropdown/Dropdown";
import PrimaryButton from "../../../components/Buttons/PrimaryButton";
import AddCollectionModal from "../../../components/Modals/AddCollectionModal";

const itemsFilterList = [
  { label: "All items" },
  { label: "Single items" },
  { label: "Bundles" },
];

const sortList = [
  { label: "Price: Low to high" },
  { label: "Price: High to low" },
];

export default function UserAssets(props) {
  const { chainIdHex, data } = props;
  const router = useRouter();
  const { address, tab } = router.query;

  const tabs = [
    { href: "", name: "NFTs" },
    { href: "?tab=activity", name: "Activity" },
    { href: "?tab=offers", name: "Offers" },
    { href: "?tab=auction", name: "On Auction" },
    { href: "?tab=collections", name: "Collections" },
  ];
  const [selectedItemsFilter, setSelectedItemsFilter] = useState(
    itemsFilterList[0]
  );
  const [selectedSort, setSelectedSort] = useState(sortList[0]);
  const [showAddCollectionModal, setShowAddCollectionModal] = useState(false);
  const total = data?.results?.length;
  const totalOnAuction = data?.auctioned?.length;

  return (
    <>
      <div className="lg:max-w-6xl mx-auto">
        <ProfileHeader
          chainIdHex={chainIdHex}
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
            />
          </div>
          <div className="flex lg:col-span-5 items-center justify-end mt-4 lg:mt-0">
            {tab === "collections" ? (
              <>
                <div>
                  <PrimaryButton
                    className="text-xs !px-5"
                    onClick={() => setShowAddCollectionModal(true)}
                  >
                    Add collection
                  </PrimaryButton>
                </div>
                <AddCollectionModal
                  isOpen={showAddCollectionModal}
                  onClose={() => setShowAddCollectionModal(false)}
                />
              </>
            ) : (
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
            )}
          </div>
        </section>
        <section className="mt-14">
          <ProfileContent data={data} />
        </section>
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const {
    params: { address },
  } = context;
  const url = `https://hexagon-api.onrender.com/users/${address}/tokens`;
  const res = await fetch(url);
  const data = await res?.json();

  return { props: { data } };
}
