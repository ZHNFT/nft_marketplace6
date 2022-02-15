import clsx from "clsx";
import { Disclosure } from '@headlessui/react'
import { MinusSmIcon, PlusSmIcon } from '@heroicons/react/solid'

export default function Sidebar({ navigation, communities, subCategories, filters }) {
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
          <h3 className="sr-only">Categories</h3>
          <ul role="list" className="text-sm font-medium text-gray-900 space-y-4 pb-6 border-b border-gray-200">
            {subCategories.map((category) => (
              <li key={category.name}>
                <a href={category.href}>{category.name}</a>
              </li>
            ))}
          </ul>

          {filters.map((section) => (
            <Disclosure as="div" key={section.id} className="border-b border-gray-200 py-6">
              {({ open }) => (
                <>
                  <h3 className="-my-3 flow-root">
                    <Disclosure.Button className="py-3 w-full flex items-center justify-between text-sm text-gray-400 hover:text-gray-500">
                      <span className="font-medium text-gray-900">{section.name}</span>
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
                      {section.options.map((option, optionIdx) => (
                        <div key={option.value} className="flex items-center">
                          <input
                            id={`filter-${section.id}-${optionIdx}`}
                            name={`${section.id}[]`}
                            defaultValue={option.value}
                            type="checkbox"
                            defaultChecked={option.checked}
                            className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
                          />
                          <label
                            htmlFor={`filter-${section.id}-${optionIdx}`}
                            className="ml-3 text-sm text-gray-600"
                          >
                            {option.label}
                          </label>
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