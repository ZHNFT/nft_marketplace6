import { useState, useEffect } from 'react';
import { stringify, parse } from 'qs';
import clsx from "clsx";
import { useRouter } from 'next/router'
import { Disclosure, RadioGroup, Transition } from '@headlessui/react'
import { MinusSmIcon, PlusSmIcon } from '@heroicons/react/solid'
import { Formik, Field, useFormikContext, FieldArray } from 'formik';
import { ArrowIcon } from '../icons';
import FilterCheckbox from './filterCheckbox';
import RangeField from '../Forms/RangeField';
import Slider from '../Slider/Slider';
import ListingFilter from './ListingFilter';

export default function Filters({ filters, total, placement }) {
  const { push, query, pathname } = useRouter()
  const { address, search } = query;
  const [selectedTraitType, setSelectedTraitType] = useState(null);

  function handleSubmit(values) {
    let appendQuery;
    let stringifiedSearch;
    if (values.query) {
      appendQuery = values.query;
    } else {
      stringifiedSearch = stringify(values, { encode: false, arrayFormat: 'indices' });
    }

    const newQuery = {
      ...query,
      ...appendQuery,
      ...(query?.sort ? { sort: query.sort } : {}),
      ...(stringifiedSearch?.length ? { search: stringifiedSearch } : {})
    };

    push({
      pathname,
      query: newQuery,
    }, undefined, { scroll: false });
  }

  return (
    <Formik
      initialValues={parse(search)}
      onSubmit={handleSubmit}
    >
      {({ submitForm, values }) => (
        <form className={clsx(placement === 'desktop' ? "" : 'mt-4 border-t border-gray-200')}>
          <h2 className="text-base font-medium leading-0">Filter</h2>
          <span className="text-xs text-manatee font-medium">
            { total } { total === 1 ? 'item' : 'items' }
          </span>
          
          {/* Price */}
          <div className="mt-10 text-xs flex justify-between">
            <span className="font-medium">Price</span>
            <div>
              <button type="button" className="font-medium">$HNY</button>
              <button type="button" className="text-manatee ml-4">USD</button>
            </div>
          </div>
          <RangeField
            step={.1}
            decimals={1}
            onChange={([min, max]) => handleSubmit({ query: { priceFrom: min, priceTo: max } })}
          />

          {/* Rarity */}
          <div className="mt-10 text-xs font-medium">Rarity</div>
          <RangeField
            step={1}
            decimals={0}
            onChange={([min, max]) => handleSubmit({ query: { rarityFrom: min, rarityTo: max } })}
          />

          {/* Listing */}
          <ListingFilter />

          {/* Traits */}
          <Disclosure as="div" className="mt-10 min-w-[200px]" defaultOpen>
            {({ open }) => (
              <>
                <Disclosure.Button className="text-xs w-full text-left pb-4 flex justify-between items-start">
                  Traits
                  <ArrowIcon type={ open ? 'up' : 'down' } className="text-manatee w-[8px] mr-1.5 relative bottom-0.5" />
                </Disclosure.Button>

                <Transition
                  show={open}
                  enter="transition duration-100 ease-out"
                  enterFrom="transform scale-95 opacity-0"
                  enterTo="transform scale-100 opacity-100"
                  leave="transition duration-75 ease-out"
                  leaveFrom="transform scale-100 opacity-100"
                  leaveTo="transform scale-95 opacity-0"
                >
                  <Disclosure.Panel static>
                    {filters?.length && (
                      <Slider arrowSize="sml">
                        <RadioGroup
                          value={selectedTraitType}
                          onChange={setSelectedTraitType}
                        >
                          <div className="flex mt-1">
                            {filters.map((traitType, index) => (
                              <RadioGroup.Option
                                key={index}
                                value={traitType.type}
                                className={({ checked }) =>
                                  `${
                                    checked ? 'border-cornflower after:bg-cornflower after:block after:m-auto after:w-full after:h-[3px] after:absolute after:left-0 after:right-0 after:bottom-0' : 'border-white'
                                  } relative no-shrink w-auto overflow-hidden mx-1 first:ml-0 bg-black/[0.05] dark:bg-white/[0.05] text-ink dark:text-white last:mr-0 text-xs rounded-md px-3 py-2 cursor-pointer flex border-[0.5px]`
                                }
                              >
                                {({ checked }) => (
                                  <>
                                    <div className="flex flex-col items-center w-full">
                                      <RadioGroup.Label
                                        as="p"
                                        className="text-center font-medium leading-1"
                                      >
                                        { traitType.type }
                                      </RadioGroup.Label>
                                      <span className="text-manatee text-xs">{ traitType.traitCount }</span>
                                    </div>
                                  </>
                                )}
                              </RadioGroup.Option>
                            ))}
                          </div>
                        </RadioGroup>
                      </Slider>
                    )}
                  </Disclosure.Panel>
                </Transition>
              </>
            )}
          </Disclosure>

          {filters?.length && filters?.map((traitType, index) => (
            <Disclosure
              as="div"
              key={`filter-${placement}-${traitType?.type}-${index}`}
              className={clsx("mt-8 border-gray-200 py-6", {
                'border-b': placement === 'desktop',
                'border-t px-4': placement === 'mobile',
              })}
            >
              {({ open }) => (
                <>
                  <h3 className={clsx("-my-3 flow-root", { '-mx-2': placement === 'mobile' })}>
                    <Disclosure.Button 
                      className={
                        clsx("py-3 w-full flex items-center justify-between dark:text-slate-200 text-gray-400 hover:text-gray-500",
                          { 'text-sm': placement === 'desktop' },
                          { 'px-2 bg-white': placement === 'mobile' }
                        )
                      }
                    >
                      <span className="font-medium dark:text-slate-200 text-gray-900">{traitType?.type}</span>
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
                    <div className={clsx(placement === 'desktop' ? "space-y-4" : 'space-y-6')}>
                      <FieldArray name={`stringTraits`}>
                        {(traitTypeArrayHelpers) => (
                          <>
                            <Field 
                              name={`stringTraits.${index}.name`}
                              hidden
                              value={traitType?.type}
                            />
                            <FieldArray name={`stringTraits.${index}.values`}>
                              {(traitValueArrayHelpers) => (
                                <>
                                  {traitType?.attributes.map((traitValue, optionIdx) => (
                                    <Field
                                      key={`filter-${placement}-${traitType?.type}-${traitValue?.value}-${optionIdx}`}
                                      component={FilterCheckbox}
                                      name={`stringTraits.${index}.values.${optionIdx}`}
                                      traitValue={traitValue?.value}
                                      traitCount={traitValue?.count}
                                      traitType={traitType?.type}
                                      placement={placement}
                                      traitValueArrayHelpers={traitValueArrayHelpers}
                                      traitTypeArrayHelpers={traitTypeArrayHelpers}
                                      value={traitValue?.value}
                                      submitForm={submitForm}
                                    />
                                  ))}
                                </>
                              )}
                            </FieldArray>
                          </>
                        )}
                      </FieldArray>
                    </div>
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          ))}
        </form>
      )}
    </Formik>
  )
}