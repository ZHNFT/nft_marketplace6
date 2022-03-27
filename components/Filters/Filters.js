import { useContext, useEffect, useRef, useCallback } from 'react';
import { stringify, parse } from 'qs';
import clsx from "clsx";
import { useRouter } from 'next/router'
import { Formik } from 'formik';
import FiltersContext from '../../contexts/FiltersContext';
import RangeField from '../Forms/RangeField';
import ListingFilter from './ListingFilter';
import TraitsFilter from './TraitsFilter';

export default function Filters({ minRarity = 0, maxRarity = 100, filters, total, placement }) {
  const { push, query, pathname } = useRouter()
  const { search } = query;
  const formRef = useRef();
  const { setTraitFilters, isFormReset, setIsFormReset } = useContext(FiltersContext);

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

    push({
      pathname,
      query: newQuery,
    }, undefined, { scroll: false });
  }, [push, pathname, query, setTraitFilters]);

  useEffect(() => {
    if (isFormReset && formRef.current) {
      formRef.current.resetForm();
      handleSubmit();
      setIsFormReset(false);
    }
  }, [isFormReset, setIsFormReset, handleSubmit]);

  return (
    <Formik
      initialValues={parse(search)}
      onSubmit={handleSubmit}
      innerRef={formRef}
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
            initialValues={[0, 100]}
            isReset={isFormReset}
            onChange={([min, max]) => handleSubmit({ query: { priceFrom: min, priceTo: max } })}
          />

          {/* Rarity */}
          <div className="mt-10 text-xs font-medium">Rarity</div>
          <RangeField
            step={1}
            decimals={0}
            min={minRarity}
            max={maxRarity}
            initialValues={[minRarity, maxRarity]}
            isReset={isFormReset}
            onChange={([min, max]) => handleSubmit({ query: { rarityFrom: min, rarityTo: max } })}
          />

          {/* Listing */}
          <ListingFilter
            isReset={isFormReset}
            onChange={({ filters }) => handleSubmit({ query: { filter: stringify(filters) } })}
          />

          {/* Traits */}
          <TraitsFilter filters={filters} submitForm={submitForm} />
        </form>
      )}
    </Formik>
  )
}