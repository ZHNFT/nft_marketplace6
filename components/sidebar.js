import clsx from "clsx";
import { useRouter } from 'next/router'
import { Disclosure } from '@headlessui/react'
import { MinusSmIcon, PlusSmIcon } from '@heroicons/react/solid'

export default function Sidebar({ navigation, filters }) {
  const router = useRouter()
  const { tableName, address } = router.query

  function handleFilterChange(e) {
    const { name, value } = e.target
    console.log(`name`, name)
    console.log(`value`, value)
    const newFilters = { tableName, address, [value]: name };

    router.push({
      pathname: router.pathname,
      query: newFilters,
    });
  }
  return (
    <div className="hidden lg:block lg:col-span-3 xl:col-span-2">
      <nav aria-label="Sidebar" className="sticky top-4 divide-y divide-gray-300">
        <div className="pb-8 space-y-1">
          {navigation.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={clsx(
                item.current ? 'bg-gray-200 text-gray-900' : 'text-gray-600 hover:bg-gray-50',
                'group flex items-center px-3 py-2 text-sm font-medium rounded-md'
              )}
              aria-current={item.current ? 'page' : undefined}
            >
              <item.icon
                className={clsx(
                  item.current ? 'text-gray-500' : 'text-gray-400 group-hover:text-gray-500',
                  'flex-shrink-0 -ml-1 mr-3 h-6 w-6'
                )}
                aria-hidden="true"
              />
              <span className="truncate">{item.name}</span>
            </a>
          ))}
        </div>
        <form className="hidden lg:block">
          {filters && Object.keys(filters)?.map((filter, id) => (
            <Disclosure as="div" key={`${filter}-${id}`} className="border-b border-gray-200 py-6">
              {({ open }) => (
                <>
                  <h3 className="-my-3 flow-root">
                    <Disclosure.Button className="py-3 w-full flex items-center justify-between text-sm text-gray-400 hover:text-gray-500">
                      <span className="font-medium text-gray-900">{filter}</span>
                      <span className="ml-6 flex items-center">
                        {open ? (
                          <MinusSmIcon className="h-5 w-5" aria-hidden="true" />
                        ) : (
                          <PlusSmIcon className="h-5 w-5" aria-hidden="true" />
                        )}
                      </span>
                    </Disclosure.Button>
                  </h3>
                  <Disclosure.Panel className="pt-6">
                    <div className="space-y-4">
                      {Object.entries(filters[filter]).map(([key, value], optionIdx) => (
                        <div key={key} className="flex items-center">
                          <input
                            id={`filter-${key}-${optionIdx}`}
                            name={`${key}[]`}
                            defaultValue={filter}
                            type="checkbox"
                            onClick={handleFilterChange}
                            className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                          />
                          <label
                            htmlFor={`filter-${key}-${optionIdx}`}
                            className="ml-3 text-sm text-gray-600"
                          >
                            {key}
                          </label>
                          <span className="ml-auto text-sm text-gray-600">
                            {value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          ))}
        </form>
      </nav>
    </div>
  );
}