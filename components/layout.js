import React, { useState, useContext } from "react";
import clsx from "clsx";
import { useRouter } from "next/router";

// Components
import Seo from "./seo";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import Sidebar from "./sidebar";
import MobileFilters from "./Filters/mobileFilters";
import Filters from "./Filters/Filters";
import {
  FireIcon,
  HomeIcon,
  TrendingUpIcon,
  UserGroupIcon,
} from "@heroicons/react/outline";
import Web3Context from "../contexts/Web3Context";

const navigation = [
  { name: "Collections", href: "#", icon: HomeIcon, current: true },
  { name: "Marketplace", href: "#", icon: FireIcon, current: false },
  { name: "Drops", href: "#", icon: TrendingUpIcon, current: false },
];

export default function Layout({ children, pageProps, connect, disconnect }) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const { pathname } = useRouter();
  const {
    state: { address },
  } = useContext(Web3Context);

  return (
    <>
      <Seo />
      <div
        className={clsx(
          "min-h-full flex flex-col",
          ['/', '/404'].includes(pathname) ? "dark:bg-[#17191d] dark:bg-main-page bg-top-center" : "dark:bg-[#202225]"
        )}
      >
        <Header
          navigation={navigation}
          connect={connect}
          disconnect={disconnect}
          address={address}
          withBorder={pathname !== "/"}
        />
        <div className="py-10 h-full">
          <div className="max-w-3xl mx-auto sm:px-6 lg:max-w-8xl lg:px-8">
            <main className="lg:col-span-9 xl:col-span-10 text-ink dark:text-white text-black">
              {React.Children.map(children, (child) => {
                if (!React.isValidElement(child)) {
                  return null;
                }

                return React.cloneElement(child, {
                  setMobileFiltersOpen,
                  ...child.props,
                });
              })}
              {/* Sidemenu filters for mobile */}
              <MobileFilters
                filters={pageProps?.collection?.traits}
                setMobileFiltersOpen={setMobileFiltersOpen}
                mobileFiltersOpen={mobileFiltersOpen}
                placement="mobile"
              />
            </main>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
