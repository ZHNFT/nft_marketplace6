import React, { useState, useContext } from "react";
import clsx from "clsx";
import { useRouter } from "next/router";
import { ToastContainer } from "react-toastify";

// Components
import Seo from "./seo";
import Header from "./Header/Header";
import Footer from "./Footer/Footer";
import MobileFilters from "./Filters/mobileFilters";
import {
  FireIcon,
  HomeIcon,
  TrendingUpIcon,
} from "@heroicons/react/outline";
import Web3Context from "../contexts/Web3Context";

const navigation = [
  { name: "Collections", href: "/collections", icon: HomeIcon, current: true }
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
          "min-h-full flex flex-col overflow-hidden",
          ['/', '/404'].includes(pathname) ? "dark:bg-[#17191d] dark:bg-main-page bg-main-page-light bg-top-center bg-cover" : "dark:bg-[#202225]"
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
          <div className="mx-auto sm:px-6 lg:max-w-8xl px-4 lg:px-8">
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
              <ToastContainer
                position="bottom-left"
                autoClose={6000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme={"dark"}
              />
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
