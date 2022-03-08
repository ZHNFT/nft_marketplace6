import React, { useState, useEffect, useCallback } from 'react';
import clsx from 'clsx';
import { useRouter } from 'next/router'

// Components
import Seo from './seo';
import Header from './Header';
import Sidebar from './sidebar';
import MobileFilters from './filters/mobileFilters';
import Filters from './filters';
import { FireIcon, HomeIcon, TrendingUpIcon, UserGroupIcon } from '@heroicons/react/outline'


const user = {
  name: 'Chelsea Hagon',
  email: 'chelseahagon@example.com',
  imageUrl:
    'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
}

const navigation = [
  { name: 'Home', href: '#', icon: HomeIcon, current: true },
  { name: 'Popular', href: '#', icon: FireIcon, current: false },
  { name: 'Trending', href: '#', icon: TrendingUpIcon, current: false },
]
const userNavigation = [
  { name: 'Your Profile', href: '/profile' },
  { name: 'Settings', href: '#' }
]

export default function Layout({ children, pageProps, connect, disconnect, address }) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const { pathname } = useRouter();

  return (
    <>
      <Seo />
      <div className="w-full h-[400px] -z-10 absolute top-[56px] left-0 bg-gradient-to-b from-[#517687] via-[#507381] to-[#fff] dark:to-[#1f2225]" />
      <div className="min-h-full">
        <Header
          user={user}
          navigation={navigation}
          userNavigation={userNavigation}
          connect={connect}
          disconnect={disconnect}
          address={address}
        />
        <div className="py-10">
          <div className="max-w-3xl mx-auto sm:px-6 lg:max-w-8xl lg:px-8 lg:grid lg:grid-cols-12 lg:gap-8">
            {
              // Sidebar menu filters for desktop
              pathname !== '/profile' && (
                  <Sidebar
                    navigation={navigation}
                  >
                    <Filters
                      placement="desktop"
                      filters={pageProps?.collection?.traits}
                    />
                </Sidebar>
              )
            }
            <main className={clsx("",
              { "lg:col-start-2 lg:col-span-10": pathname === '/profile' },
              { "lg:col-span-9 xl:col-span-10": pathname !== '/profile' }
            )}>
              {React.Children.map(children, child => {
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
      </div>
    </>
  )
}