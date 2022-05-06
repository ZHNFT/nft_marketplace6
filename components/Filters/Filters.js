import { useState, useContext, useEffect, useRef, useCallback } from 'react';
import { stringify, parse } from 'qs';
import clsx from "clsx";
import { useRouter } from 'next/router'
import { Formik } from 'formik';
import FiltersContext from '../../contexts/FiltersContext';
import RangeField from '../Forms/RangeField';
import ListingFilter from './ListingFilter';
import TraitsFilter from './TraitsFilter';

export default function Filters({ minRarity = 0, maxRarity = 100, filters, currency, total, placement, minPrice = 0, maxPrice = 100 }) {
  const { push, query, pathname, isReady: isRouterReady } = useRouter();
  const { search, priceFrom, priceTo, rarityFrom, rarityTo, filter } = query;
  const [initialPrice, setInitialPrice] = useState();
  const [initialRarity, setInitialRarity] = useState();
  const formRef = useRef();
  const { setTraitFilters, setQueryFilters, isPriceReset, setIsPriceReset, isRarityReset, setIsRarityReset, isFormReset, setIsFormReset } = useContext(FiltersContext);

  const getQueryFilters = query => (
    Object.keys(query)
      .reduce((acc, key) => {
        if (query[key] !== undefined) {
          if (key === 'priceFrom' || key === 'priceTo') {
            acc.price[key] = query[key];
            return acc;
          }

          if (key === 'rarityFrom' || key === 'rarityTo') {
            acc.rarity[key] = query[key];
            return acc;
          }

          if (key === 'filter') {
            acc[key] = query[key];
            return acc;
          }
        }
        return acc;
    }, { filter: '', price: {}, rarity: {} })
  ); 
  const handleSubmit = useCallback(function(values) {
    if (!values) {
      // reset
      push({
        pathname,
        query: { address: query.address },
      }, undefined, { scroll: false });
      setTraitFilters(null);
      return;
    }

    let appendQuery;
    let searchQuery;
    if (values.query) {
      appendQuery = values.query;
      searchQuery = query?.search ? { search: query.search } : {};
    } else {
      setTraitFilters(values);
      const stringifiedSearch = stringify(values, { encode: false, arrayFormat: 'indices' });
      searchQuery = stringifiedSearch?.length ? { search: stringifiedSearch } : { search: null};
    }

    const newQuery = {
      ...query,
      ...(query?.sort ? { sort: query.sort } : {}),
      ...(query?.filter ? { filter: query.filter } : {}),
      ...appendQuery,
      ...searchQuery
    };

    // set query filters for FilterTags
    setQueryFilters(getQueryFilters(newQuery));
    
    push({
      pathname,
      query: newQuery,
    }, undefined, { scroll: false });
  }, [push, pathname, query, setTraitFilters, setQueryFilters]);

  useEffect(() => {
    // initialize filters from query params on initial page load
    if(!isRouterReady) return;
    
    setInitialPrice([Number(priceFrom) || minPrice, Number(priceTo) || maxPrice]);
    setInitialRarity([Number(rarityFrom) || minRarity, Number(rarityTo) || maxRarity]);

    // initialize filter tags
    const searchParams = parse(search);
    formRef.current.setFieldValue('stringTraits', searchParams?.stringTraits || []);
    setTraitFilters(searchParams);
    setQueryFilters(getQueryFilters({ priceFrom, priceTo, rarityFrom, rarityTo, filter }));
  }, [isRouterReady]);

  useEffect(() => {
    if (isFormReset && formRef.current) {
      formRef.current.resetForm();
      handleSubmit();
      setIsFormReset(false);
    }
  }, [isFormReset, setIsFormReset, handleSubmit]);

  useEffect(() => {
    if (isPriceReset) {
      setIsPriceReset(false);
    }
  }, [isPriceReset]);

  useEffect(() => {
    if (isRarityReset) {
      setIsRarityReset(false);
    }
  }, [isRarityReset]);

  return (
    <Formik
      initialValues={parse(search)}
      onSubmit={handleSubmit}
      innerRef={formRef}
    >
      {({ submitForm, values, setFieldValue }) => (
        <form className={clsx(placement === 'desktop' ? "" : 'mt-4 border-t border-gray-200')}>
          <h2 className="text-base font-medium leading-0">Filter</h2>
          <span className="text-xs dark:text-manatee text-frost font-medium">
            { total } { total === 1 ? 'item' : 'items' }
          </span>
          
          {/* Price */
            maxPrice > minPrice && initialPrice && (
              <>
                <div className="mt-10 text-xs flex justify-between">
                  <span className="font-medium">Price</span>
                  <div>
                    <button type="button" className="font-medium">${currency}</button>
                    {/* <button type="button" className="text-manatee ml-4">USD</button> */}
                  </div>
                </div>

                <RangeField
                  step={0.1}
                  decimals={1}
                  min={minPrice}
                  max={maxPrice}
                  initialValues={initialPrice}
                  isReset={isPriceReset || isFormReset}
                  onChange={([min, max]) => handleSubmit({ query: { priceFrom: min, priceTo: max } })}
                /> 
              </>
            )
          }

          { /* Rarity */
            maxRarity > minRarity && initialRarity && (
              <>
                <div className="mt-10 text-xs font-medium">Rarity</div>
                <RangeField
                  step={1}
                  decimals={0}
                  min={minRarity}
                  max={maxRarity}
                  initialValues={initialRarity}
                  isReset={isRarityReset || isFormReset}
                  onChange={([min, max]) => handleSubmit({ query: { rarityFrom: min, rarityTo: max } })}
                />
              </>
            )
          }

          {/* Listing */}
          <ListingFilter
            isReset={isFormReset}
            onChange={({ filters }) => handleSubmit({ query: { filter: filters } })}
          />

          {/* Traits */}
          <TraitsFilter formValues={values} setFieldValue={setFieldValue} filters={filters} submitForm={submitForm} />
        </form>
      )}
    </Formik>
  )
}