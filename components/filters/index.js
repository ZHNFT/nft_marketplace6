import { useState, useEffect } from 'react';
import { stringify, parse } from 'qs';
import clsx from "clsx";
import { useRouter } from 'next/router'
import { Disclosure } from '@headlessui/react'
import { MinusSmIcon, PlusSmIcon } from '@heroicons/react/solid'
import { Formik, Field, useFormikContext, FieldArray } from 'formik';
import FilterCheckbox from './filterCheckbox';

export default function Filters({ filters, placement }) {
  const { push, query, pathname } = useRouter()
  const { tableName, address, search } = query;

  function handleSubmit(values) {
    const stringifiedSearch = stringify(values, { encode: false, arrayFormat: 'indices' });
    const newQuery = { tableName, address, search: stringifiedSearch };

    push({
      pathname: `${pathname}`,
      query: newQuery,
    });
  }

  console.log(`parse(search)`, parse(search))

  console.log(`filters`, filters)

  return (
    <Formik
      initialValues={parse(search)}
      onSubmit={handleSubmit}
    >
      {({ submitForm, values }) => (
        <form className={clsx(placement === 'desktop' ? "hidden lg:block" : 'mt-4 border-t border-gray-200')}>
          {filters && Object.keys(filters)?.map((traitType, index) => (
            <Disclosure
              as="div"
              key={`filter-${placement}-${traitType}-${index}`}
              className={clsx("border-gray-200 py-6", {
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
                      <span className="font-medium dark:text-slate-200 text-gray-900">{traitType}</span>
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
                        {(arrayHelpers) => (
                          <>
                            {Object.entries(filters[traitType]).map(([traitValue, traitCount], optionIdx) => (
                                <Field
                                  key={`filter-${placement}-${traitType}-${traitValue}-${optionIdx}`}
                                  component={FilterCheckbox}
                                  name={`stringTraits.${index}.values.${optionIdx}`}
                                  traitValue={traitValue}
                                  traitCount={traitCount}
                                  traitType={traitType}
                                  placement={placement}
                                  arrayHelpers={arrayHelpers}
                                  value={traitValue}
                                  submitForm={submitForm}
                                />
                            ))}
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